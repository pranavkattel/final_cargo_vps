import React, { useEffect, useState } from 'react';
import trackingService, { ShipmentData, DropdownOption, trackingAPI } from '../services/trackingService';
import { StatusDropdown, ServiceTypeDropdown } from '../components/EnhancedDropdown';
import MapDestinationSelector from '../components/MapDestinationSelector';

const AdminTracking: React.FC = () => {
  const [orders, setOrders] = useState<ShipmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editOrder, setEditOrder] = useState<ShipmentData | null>(null);
  
  // Enhanced form states
  const [dropdownOptions, setDropdownOptions] = useState<Record<string, DropdownOption[]>>({});
  const [showMapDestination, setShowMapDestination] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
    city: string;
    country: string;
    formattedAddress: string;
  } | null>(null);

  // Debug: Log component mount
  console.log('AdminTracking component mounted');

  // Form state
  const [form, setForm] = useState({
    trackingId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    origin: '',
    destination: '',
    weight: '',
    serviceType: '',
    description: '',
    status: '',
    estimatedDelivery: '',
  });

  // Helper to resolve estimated delivery from multiple possible locations
  const resolveEstimatedDelivery = (order: any): string | null => {
    if (order?.estimatedDelivery) return order.estimatedDelivery;
    if (order?.shipmentDetails && (order as any).shipmentDetails.estimatedDelivery) return (order as any).shipmentDetails.estimatedDelivery;
    if (order?.createdAt) {
      try {
        const created = new Date(order.createdAt);
        if (!isNaN(created.getTime())) {
          const d = new Date(created.getTime() + 5 * 24 * 60 * 60 * 1000);
          return d.toISOString();
        }
      } catch (e) {
        // ignore
      }
    }
    return null;
  };

  // Fetch all orders
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await trackingService.getAllShipments(1, 100);
      console.log('API Response:', res); // Debug log
      
      let orders = res.data || [];
      console.log('Orders from API:', orders); // Debug log
      
      // Fallback to mock/demo data if nothing in DB
      if (orders.length === 0) {
        console.log('No orders from API, using mock data'); // Debug log
        orders = [
          trackingService.generateMockTrackingData('DEMO123'),
          trackingService.generateMockTrackingData('TEST456'),
          trackingService.generateMockTrackingData('CC001234'),
          trackingService.generateMockTrackingData('CC005678'),
        ].filter(Boolean) as ShipmentData[];
      }
      
      console.log('Final orders to display:', orders); // Debug log
      setOrders(orders);
      if (orders.length > 0) {
        setError(null); // Clear error if we have data
      }
    } catch (e: any) {
      console.error('Fetch orders error:', e); // Debug log
      // On error, show mock/demo data
      const mockOrders = [
        trackingService.generateMockTrackingData('DEMO123'),
        trackingService.generateMockTrackingData('TEST456'),
        trackingService.generateMockTrackingData('CC001234'),
        trackingService.generateMockTrackingData('CC005678'),
      ].filter(Boolean) as ShipmentData[];
      
      setOrders(mockOrders);
      setError(`Failed to fetch orders from backend: ${e.message}. Showing demo data.`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch dropdown options
  const fetchDropdownOptions = async () => {
    try {
      console.log('🔄 Starting to fetch dropdown options...');
      const options = await trackingAPI.getDropdownOptions();
      console.log('✅ Dropdown options received:', options);
      console.log('📊 Status options count:', options.status?.length || 0);
      console.log('📊 Service type options count:', options.serviceType?.length || 0);
      setDropdownOptions(options);
    } catch (error) {
      console.error('❌ Failed to load dropdown options:', error);
      setError(`Failed to load dropdown options: ${error}`);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchDropdownOptions();
  }, []);

  // Handle form input
  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or update order
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Frontend validation
    if (!form.customerName?.trim()) {
      setError('❌ Customer name is required');
      return;
    }
    if (!form.customerEmail?.trim()) {
      setError('❌ Customer email is required');
      return;
    }
    if (!form.customerPhone?.trim()) {
      setError('❌ Customer phone is required');
      return;
    }
    if (!form.customerAddress?.trim()) {
      setError('❌ Customer address is required');
      return;
    }
    if (!form.origin?.trim()) {
      setError('❌ Origin location is required');
      return;
    }
    if (!form.destination?.trim()) {
      setError('❌ Destination location is required');
      return;
    }
    if (!form.weight?.trim() || isNaN(parseFloat(form.weight))) {
      setError('❌ Valid weight is required');
      return;
    }
    
    try {
      if (editOrder) {
        console.log('🔄 Updating shipment:', editOrder.trackingId);
        
        // Update complete shipment data
        const result = await trackingService.updateShipment(editOrder.trackingId, {
          customerInfo: {
            name: form.customerName.trim(),
            email: form.customerEmail.trim(),
            phone: form.customerPhone.trim(),
            address: form.customerAddress.trim(),
          },
          shipmentDetails: {
            origin: form.origin.trim(),
            destination: form.destination.trim(),
            weight: parseFloat(form.weight),
            serviceType: form.serviceType || 'standard',
            description: form.description?.trim() || 'General cargo',
          },
          status: form.status || 'processing',
          estimatedDelivery: form.estimatedDelivery,
        });
        
        console.log('✅ Update successful:', result);
        setError(`✅ Shipment ${result.trackingId} updated successfully!`);
      } else {
        // Create new shipment - tracking ID will be auto-generated by backend
        console.log('🆕 Creating new shipment...');

        const result = await trackingService.createShipment({
          customerInfo: {
            name: form.customerName.trim(),
            email: form.customerEmail.trim(),
            phone: form.customerPhone.trim(),
            address: form.customerAddress.trim(),
          },
          shipmentDetails: {
            origin: form.origin.trim(),
            destination: form.destination.trim(),
            weight: parseFloat(form.weight),
            serviceType: form.serviceType || 'standard',
            description: form.description?.trim() || 'General cargo',
          },
          status: form.status || 'processing',
          events: [],
          estimatedDelivery: form.estimatedDelivery,
        });
        
        console.log('✅ Create successful:', result);
        setError(`✅ New shipment created! Tracking ID: ${result.trackingId}`);
      }
      
      // Reset form and close
      setShowForm(false);
      setEditOrder(null);
      setForm({
        trackingId: '', customerName: '', customerEmail: '', customerPhone: '', customerAddress: '',
        origin: '', destination: '', weight: '', serviceType: '', description: '', status: '', estimatedDelivery: '',
      });
      setSelectedLocation(null);
      
      // Refresh the orders list
      fetchOrders();
      
      // Clear success message after 5 seconds
      setTimeout(() => setError(null), 5000);
      
    } catch (e: any) {
      console.error('❌ Save order error:', e);
      setError(`❌ Failed to ${editOrder ? 'update' : 'create'} shipment: ${e.message || e.toString()}`);
    }
  };

  // Edit order
  const handleEdit = (order: ShipmentData) => {
    setEditOrder(order);
    setForm({
      trackingId: order.trackingId,
      customerName: order.customerInfo.name,
      customerEmail: order.customerInfo.email,
      customerPhone: order.customerInfo.phone,
      customerAddress: order.customerInfo.address,
      origin: order.shipmentDetails.origin,
      destination: order.shipmentDetails.destination,
      weight: order.shipmentDetails.weight.toString(),
      serviceType: order.shipmentDetails.serviceType,
      description: order.shipmentDetails.description,
      status: order.status,
      // Normalize to `YYYY-MM-DD` for HTML date input
      // Prefer top-level estimatedDelivery, fall back to nested shipmentDetails
      estimatedDelivery: (() => {
        const ed = resolveEstimatedDelivery(order);
        return ed ? new Date(ed).toISOString().split('T')[0] : '';
      })(),
    });
    setShowForm(true);
  };

  // Delete order
  const handleDelete = async (trackingId: string) => {
    if (!window.confirm('Delete this order?')) return;
    console.log('Delete requested for:', trackingId);
    // TODO: Implement delete API in backend
    setError('Delete functionality not yet implemented in backend API');
  };

  // Handle location selection from map
  const handleLocationSelect = (location: any) => {
    setSelectedLocation(location);
    setForm({
      ...form,
      destination: location.formattedAddress,
    });
    setShowMapDestination(false);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin: Manage Tracking Orders</h1>
      {error && (
        <div className={`p-4 mb-4 rounded-lg ${error.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {error}
        </div>
      )}
      <button
        className="mb-6 px-6 py-3 bg-primary-blue hover:bg-accent-orange text-white rounded-lg font-medium transition-colors focus:ring-2 focus:ring-accent-orange focus:ring-offset-2 shadow-md"
        onClick={() => {
          setShowForm(true);
          setEditOrder(null);
          // Set default values for new shipment
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 5); // Default 5 days from now
          setForm({
            trackingId: '', 
            customerName: '', 
            customerEmail: '', 
            customerPhone: '', 
            customerAddress: '',
            origin: '', 
            destination: '', 
            weight: '', 
            serviceType: 'standard', // Default service type
            description: '', 
            status: 'processing', // Default status
            estimatedDelivery: tomorrow.toISOString().split('T')[0], // Default delivery date
          });
          setSelectedLocation(null);
          setShowMapDestination(false);
        }}
      >
        + Add New Order
      </button>
      {showForm && (
        <form className="bg-primary-white p-6 rounded-lg shadow-lg mb-6 border border-gray-200" onSubmit={handleSubmit}>
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {editOrder ? '✏️ Edit Shipment' : '🆕 Create New Shipment'}
            </h3>
            {editOrder ? (
              <div className="flex items-center space-x-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tracking ID</label>
                  <div className="px-3 py-2 bg-gray-100 rounded-lg text-gray-800 font-mono font-bold text-lg border">
                    {form.trackingId}
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Editing existing shipment</p>
                  <p>Status: <span className="font-semibold">{editOrder.status}</span></p>
                </div>
              </div>
            ) : (
              <div className="text-sm text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
                <p className="flex items-center">
                  <span className="mr-2">🏷️</span>
                  <strong>Tracking ID will be automatically generated when you submit the form</strong>
                </p>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
              <input 
                name="customerName" 
                value={form.customerName} 
                onChange={handleInput} 
                placeholder="Enter customer name" 
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Email</label>
              <input 
                name="customerEmail" 
                value={form.customerEmail} 
                onChange={handleInput} 
                placeholder="Enter email address" 
                type="email"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Phone</label>
              <input 
                name="customerPhone" 
                value={form.customerPhone} 
                onChange={handleInput} 
                placeholder="Enter phone number" 
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Address</label>
              <input 
                name="customerAddress" 
                value={form.customerAddress} 
                onChange={handleInput} 
                placeholder="Enter customer address" 
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
              <input 
                name="origin" 
                value={form.origin} 
                onChange={handleInput} 
                placeholder="Enter pickup location" 
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent" 
                required 
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
              <div className="flex">
                <input
                  name="destination"
                  value={form.destination}
                  onChange={handleInput}
                  placeholder="Enter destination address"
                  className="flex-1 border border-gray-300 p-3 rounded-l-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowMapDestination(!showMapDestination)}
                  className={`px-4 py-3 border-t border-r border-b rounded-r-lg font-medium transition-colors ${
                    showMapDestination 
                      ? 'bg-green-500 text-white border-green-500' 
                      : 'bg-primary-blue text-white border-primary-blue hover:bg-accent-orange'
                  }`}
                  title={showMapDestination ? 'Hide map selection' : 'Select on map'}
                >
                  {showMapDestination ? '🗺️ Hide Map' : '🗺️ Select'}
                </button>
              </div>
              {selectedLocation && (
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                  <span className="text-gray-700">📍 Selected: {selectedLocation.city}, {selectedLocation.country}</span>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
              <input 
                name="weight" 
                value={form.weight} 
                onChange={handleInput} 
                placeholder="Enter package weight" 
                type="number"
                step="0.1"
                min="0"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent" 
                required 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                {/* Debug info */}
                {import.meta.env.DEV && (
                  <div className="text-xs text-gray-500 mb-1">
                    Debug: {dropdownOptions.serviceType?.length || 0} service options available
                  </div>
                )}
                <ServiceTypeDropdown
                  value={form.serviceType}
                  onChange={(value) => setForm({ ...form, serviceType: value })}
                  options={dropdownOptions.serviceType || []}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                {/* Debug info */}
                {import.meta.env.DEV && (
                  <div className="text-xs text-gray-500 mb-1">
                    Debug: {dropdownOptions.status?.length || 0} status options available
                  </div>
                )}
                <StatusDropdown
                  value={form.status}
                  onChange={(value) => setForm({ ...form, status: value })}
                  options={dropdownOptions.status || []}
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Package Description <span className="text-gray-400">(optional)</span>
              </label>
              <textarea 
                name="description" 
                value={form.description} 
                onChange={handleInput} 
                placeholder="Describe the package contents and any special instructions (optional)" 
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent" 
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Delivery Date</label>
              <input 
                name="estimatedDelivery" 
                value={form.estimatedDelivery} 
                onChange={handleInput} 
                type="date"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent" 
                required 
              />
            </div>
          </div>
          <div className="mt-6 flex gap-3 pt-4 border-t border-gray-200">
            <button 
              type="submit" 
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              {editOrder ? '✓ Update Order' : '+ Add Order'}
            </button>
            <button 
              type="button" 
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2" 
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      {showMapDestination && (
        <div className="bg-primary-white p-4 rounded shadow mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Select Destination on Map</h2>
            <button
              type="button"
              onClick={() => setShowMapDestination(false)}
              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              ✕ Close
            </button>
          </div>
          <MapDestinationSelector
            onLocationSelect={handleLocationSelect}
          />
          {selectedLocation && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-1">Selected Location</h4>
              <p className="text-sm text-green-700">
                📍 {selectedLocation.city}, {selectedLocation.country}
              </p>
              <p className="text-xs text-green-600">
                Address: {selectedLocation.formattedAddress}
              </p>
            </div>
          )}
        </div>
      )}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full bg-primary-white rounded shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Tracking ID</th>
              <th className="p-2">Customer</th>
              <th className="p-2">Origin</th>
              <th className="p-2">Destination</th>
              <th className="p-2">Status</th>
              <th className="p-2">Est. Delivery</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.trackingId} className="border-t">
                <td className="p-2 font-mono">{order.trackingId}</td>
                <td className="p-2">{order.customerInfo.name}</td>
                <td className="p-2">{order.shipmentDetails.origin}</td>
                <td className="p-2">{order.shipmentDetails.destination}</td>
                <td className="p-2">{order.status}</td>
                <td className="p-2">{
                  (() => {
                    const ed = resolveEstimatedDelivery(order);
                    return ed ? new Date(ed).toLocaleDateString() : 'N/A';
                  })()
                }</td>
                <td className="p-2 flex gap-2">
                  <button className="bg-yellow-500 text-white px-2 py-1 rounded" onClick={() => handleEdit(order)}>Edit</button>
                  <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => handleDelete(order.trackingId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminTracking;
