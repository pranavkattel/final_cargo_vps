import React, { useState, useEffect } from 'react';
import { trackingAPI, ShipmentData, adminAPI } from '../services/trackingService';

interface DashboardStats {
  totalOrders: number;
  inTransit: number;
  deliveredToday: number;
  delayedOrUrgent: number;
  pendingOrders: number;
  statusDistribution: Record<string, number>;
}

const UnifiedAdminPanel: React.FC = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'orders' | 'settings'>('dashboard');
  const [orders, setOrders] = useState<ShipmentData[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    inTransit: 0,
    deliveredToday: 0,
    delayedOrUrgent: 0,
    pendingOrders: 0,
    statusDistribution: {}
  });
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<ShipmentData | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(false);

  // Settings state
  const [adminSettings, setAdminSettings] = useState({
    name: 'Admin User',
  email: 'info@cargocapital.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notifications: true,
    darkMode: false,
    autoLogout: 30
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await trackingAPI.getAllShipments();
      const ordersData = response.data || [];
      setOrders(ordersData);
      
      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const stats: DashboardStats = {
        totalOrders: ordersData.length,
        inTransit: ordersData.filter(o => o.status === 'in-transit').length,
        deliveredToday: ordersData.filter(o => 
          o.status === 'delivered' && 
          o.estimatedDelivery?.startsWith(today)
        ).length,
        delayedOrUrgent: ordersData.filter(o => {
          const estDelivery = new Date(o.estimatedDelivery || '');
          const now = new Date();
          return estDelivery < now && o.status !== 'delivered';
        }).length,
        pendingOrders: ordersData.filter(o => o.status === 'processing' || o.status === 'pending').length,
        statusDistribution: ordersData.reduce((acc, order) => {
          acc[order.status] = (acc[order.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };
      setStats(stats);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      'processing': 'bg-yellow-100 text-yellow-800',
      'picked-up': 'bg-smoke-medium text-smoke-dark',
      'in-transit': 'bg-primary-blue text-smoke-darker',
      'out-for-delivery': 'bg-smoke-medium text-smoke-dark',
      'delivered': 'bg-green-100 text-green-800',
      'failed-delivery': 'bg-red-100 text-red-800',
      'returned': 'bg-purple-100 text-purple-800',
      'cancelled': 'bg-gray-200 text-gray-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string): string => {
    const icons: Record<string, string> = {
      'processing': '⏳',
      'picked-up': '📦',
      'in-transit': '🚚',
      'out-for-delivery': '🚛',
      'delivered': '✅',
      'failed-delivery': '❌',
      'returned': '↩️',
      'cancelled': '🚫',
    };
    return icons[status] || '📦';
  };

  // Helper to resolve estimated delivery from multiple possible locations
  const resolveEstimatedDelivery = (order: any): string | null => {
    // Prefer top-level estimatedDelivery
    if (order?.estimatedDelivery) return order.estimatedDelivery;
    // Fallback to nested shipmentDetails.estimatedDelivery
    if (order?.shipmentDetails && (order as any).shipmentDetails.estimatedDelivery) return (order as any).shipmentDetails.estimatedDelivery;
    // Fallback to createdAt + 5 days
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = async (trackingId: string, newStatus: string) => {
    try {
      await trackingAPI.updateShipmentStatus(trackingId, newStatus, `Status updated by admin`, '');
      await fetchOrders();
    } catch (error) {
      alert('Failed to update status.');
      await fetchOrders();
    }
  };

  const handleDeleteOrder = async (trackingId: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await trackingAPI.deleteShipment(trackingId);
        await fetchOrders();
      } catch (error) {
        alert('Failed to delete order.');
        await fetchOrders();
      }
    }
  };

  const AddOrderModal = () => {
    const [newOrder, setNewOrder] = useState({
      trackingId: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      customerAddress: '',
      origin: '',
      destination: '',
      weight: '',
      dimensions: { length: '', width: '', height: '' },
      value: '',
      serviceType: 'standard',
      status: 'pending',
      estimatedDelivery: '',
      description: ''
    });

    // generate a friendly preview tracking id when modal opens
    useEffect(() => {
      const generateTrackingId = () => {
        const prefix = 'CC';
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substr(2, 4).toUpperCase();
        return `${prefix}${timestamp}${random}`;
      };

      setNewOrder(prev => ({ ...prev, trackingId: generateTrackingId() }));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      // basic validation for required fields
      if (!newOrder.customerName.trim()) {
        alert('Customer name is required');
        return;
      }

      if (!newOrder.customerPhone.trim()) {
        alert('Customer phone is required');
        return;
      }

      if (!newOrder.customerAddress.trim()) {
        alert('Customer address is required');
        return;
      }

      if (!newOrder.origin.trim() || !newOrder.destination.trim()) {
        alert('Origin and destination are required');
        return;
      }

      if (!newOrder.weight || parseFloat(newOrder.weight) <= 0) {
        alert('Please provide a valid weight');
        return;
      }

      if (!newOrder.description.trim()) {
        alert('Shipment description is required');
        return;
      }

      if (!newOrder.estimatedDelivery) {
        alert('Estimated delivery date is required');
        return;
      }

      try {
        // build dimensions object only if any dimension provided
        const dims: any = {};
        if (newOrder.dimensions.length) dims.length = parseFloat(newOrder.dimensions.length);
        if (newOrder.dimensions.width) dims.width = parseFloat(newOrder.dimensions.width);
        if (newOrder.dimensions.height) dims.height = parseFloat(newOrder.dimensions.height);

        const shipmentDetailsObj: any = {
          origin: newOrder.origin,
          destination: newOrder.destination,
          weight: parseFloat(newOrder.weight) || 0,
          serviceType: newOrder.serviceType,
          description: newOrder.description || ''
        };

        if (Object.keys(dims).length > 0) {
          shipmentDetailsObj.dimensions = dims;
        }

        if (newOrder.value) shipmentDetailsObj.value = parseFloat(newOrder.value);

        const orderData = {
          // include the preview trackingId (backend will assign final one if needed)
          trackingId: newOrder.trackingId,
          customerInfo: {
            name: newOrder.customerName,
            email: newOrder.customerEmail,
            phone: newOrder.customerPhone,
            address: newOrder.customerAddress || ''
          },
          shipmentDetails: shipmentDetailsObj,
          status: newOrder.status,
          estimatedDelivery: new Date(newOrder.estimatedDelivery).toISOString(),
          events: [
            {
              status: newOrder.status,
              timestamp: new Date().toISOString(),
              location: newOrder.origin,
              description: 'Order created by admin',
              completed: true
            }
          ]
        };

        const response = await trackingAPI.createShipment(orderData);
        console.log('Created shipment:', response);

        // Extract final tracking ID returned by backend (fallback to preview)
        const finalTrackingId = (response && (response as any).trackingId) || orderData.trackingId;

        // Try to copy tracking ID to clipboard (best-effort)
        try {
          if (finalTrackingId && navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(finalTrackingId);
          }
        } catch (err) {
          // ignore clipboard errors
        }

        // Inform admin of the final tracking ID
        alert(`Shipment created successfully!\nTracking ID: ${finalTrackingId}${finalTrackingId ? ' (copied to clipboard)' : ''}`);

        setShowAddModal(false);
        setNewOrder({
          trackingId: '',
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          customerAddress: '',
          origin: '',
          destination: '',
          weight: '',
          dimensions: { length: '', width: '', height: '' },
          value: '',
          serviceType: 'standard',
          status: 'pending',
          estimatedDelivery: '',
          description: ''
        });
        await fetchOrders();
      } catch (error) {
        console.error('Error creating order:', error);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-primary-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Add New Order</h3>
            <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tracking ID (auto-generated)</label>
              <input
                type="text"
                readOnly
                value={newOrder.trackingId}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                placeholder="Auto-generated"
              />
              <p className="text-xs text-gray-400 mt-1">The system will create a final tracking ID on save; this is a preview.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
              <input
                type="text"
                required
                value={newOrder.customerName}
                onChange={(e) => setNewOrder({...newOrder, customerName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Email</label>
              <input
                type="email"
                value={newOrder.customerEmail}
                onChange={(e) => setNewOrder({...newOrder, customerEmail: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Phone</label>
              <input
                type="tel"
                required
                value={newOrder.customerPhone}
                onChange={(e) => setNewOrder({...newOrder, customerPhone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="+1-555-0123"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Address</label>
              <input
                type="text"
                value={newOrder.customerAddress}
                onChange={(e) => setNewOrder({...newOrder, customerAddress: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Street, City, Country"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
                <input
                  type="text"
                  required
                  value={newOrder.origin}
                  onChange={(e) => setNewOrder({...newOrder, origin: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="New York, NY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                <input
                  type="text"
                  required
                  value={newOrder.destination}
                  onChange={(e) => setNewOrder({...newOrder, destination: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Los Angeles, CA"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={newOrder.weight}
                  onChange={(e) => setNewOrder({...newOrder, weight: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="10.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                <select
                  value={newOrder.serviceType}
                  onChange={(e) => setNewOrder({...newOrder, serviceType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="standard">Standard</option>
                  <option value="express">Express</option>
                  <option value="overnight">Overnight</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Delivery Date</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={newOrder.estimatedDelivery}
                  onChange={(e) => setNewOrder({...newOrder, estimatedDelivery: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-primary-white"
                />
                <p className="text-xs text-gray-400 mt-1">Enter the expected delivery date (required)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shipment Description / Notes</label>
                <textarea
                  required
                  value={newOrder.description}
                  onChange={(e) => setNewOrder({...newOrder, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Description or handling notes (required)"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-smoke-dark text-white rounded-lg hover:bg-accent-orange-hover"
              >
                Add Order
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const EditOrderModal = () => {
    if (!editingOrder) return null;

    const [editForm, setEditForm] = useState({
      customerName: editingOrder.customerInfo.name,
      customerEmail: editingOrder.customerInfo.email,
      customerPhone: editingOrder.customerInfo.phone,
      customerAddress: editingOrder.customerInfo.address,
      origin: editingOrder.shipmentDetails.origin,
      destination: editingOrder.shipmentDetails.destination,
      weight: editingOrder.shipmentDetails.weight.toString(),
      dimensions: {
        length: (editingOrder.shipmentDetails as any).dimensions?.length?.toString() || '',
        width: (editingOrder.shipmentDetails as any).dimensions?.width?.toString() || '',
        height: (editingOrder.shipmentDetails as any).dimensions?.height?.toString() || ''
      },
      value: (editingOrder.shipmentDetails as any).value?.toString() || '',
      serviceType: editingOrder.shipmentDetails.serviceType || 'standard',
      status: editingOrder.status,
      estimatedDelivery: (() => {
        const ed = resolveEstimatedDelivery(editingOrder);
        return ed ? new Date(ed).toISOString().split('T')[0] : '';
      })(),
      description: editingOrder.shipmentDetails.description || ''
    });

    const handleEditSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!editForm.customerName.trim() || !editForm.customerEmail.trim() || !editForm.origin.trim() || !editForm.destination.trim()) {
        alert('Please fill in all required fields');
        return;
      }

      try {
        const dims: any = {};
        if (editForm.dimensions.length) dims.length = parseFloat(editForm.dimensions.length);
        if (editForm.dimensions.width) dims.width = parseFloat(editForm.dimensions.width);
        if (editForm.dimensions.height) dims.height = parseFloat(editForm.dimensions.height);

        const shipmentDetailsObj: any = {
          origin: editForm.origin,
          destination: editForm.destination,
          weight: parseFloat(editForm.weight) || 0,
          serviceType: editForm.serviceType,
          description: editForm.description || ''
        };

        if (Object.keys(dims).length > 0) {
          shipmentDetailsObj.dimensions = dims;
        }

        if (editForm.value) shipmentDetailsObj.value = parseFloat(editForm.value);

        const updateData = {
          customerInfo: {
            name: editForm.customerName,
            email: editForm.customerEmail,
            phone: editForm.customerPhone,
            address: editForm.customerAddress || ''
          },
          shipmentDetails: shipmentDetailsObj,
          status: editForm.status,
          estimatedDelivery: editForm.estimatedDelivery ? new Date(editForm.estimatedDelivery).toISOString() : undefined
        };

        await trackingAPI.updateShipment(editingOrder.trackingId, updateData);
        alert(`Order ${editingOrder.trackingId} updated successfully!`);
        
        setShowEditModal(false);
        setEditingOrder(null);
        await fetchOrders();
      } catch (error) {
        console.error('Error updating order:', error);
        alert('Failed to update order. Please try again.');
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-primary-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Edit Order: {editingOrder.trackingId}</h3>
            <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>

          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={editForm.customerName}
                  onChange={(e) => setEditForm({...editForm, customerName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Email</label>
                <input
                  type="email"
                  required
                  value={editForm.customerEmail}
                  onChange={(e) => setEditForm({...editForm, customerEmail: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Phone</label>
                <input
                  type="tel"
                  value={editForm.customerPhone}
                  onChange={(e) => setEditForm({...editForm, customerPhone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Address</label>
                <input
                  type="text"
                  value={editForm.customerAddress}
                  onChange={(e) => setEditForm({...editForm, customerAddress: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
                <input
                  type="text"
                  required
                  value={editForm.origin}
                  onChange={(e) => setEditForm({...editForm, origin: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                <input
                  type="text"
                  required
                  value={editForm.destination}
                  onChange={(e) => setEditForm({...editForm, destination: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={editForm.weight}
                  onChange={(e) => setEditForm({...editForm, weight: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                <select
                  value={editForm.serviceType}
                  onChange={(e) => setEditForm({...editForm, serviceType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="standard">Standard</option>
                  <option value="express">Express</option>
                  <option value="overnight">Overnight</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="processing">⏳ Processing</option>
                  <option value="picked-up">📦 Picked Up</option>
                  <option value="in-transit">🚚 In Transit</option>
                  <option value="out-for-delivery">🚛 Out for Delivery</option>
                  <option value="delivered">✅ Delivered</option>
                  <option value="failed-delivery">❌ Failed Delivery</option>
                  <option value="returned">↩️ Returned</option>
                  <option value="cancelled">🚫 Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Delivery</label>
                <input
                  type="date"
                  value={editForm.estimatedDelivery}
                  onChange={(e) => setEditForm({...editForm, estimatedDelivery: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-smoke-dark text-white rounded-lg hover:bg-accent-orange-hover"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!adminSettings.currentPassword || !adminSettings.newPassword || !adminSettings.confirmPassword) {
      alert('Please fill in all password fields.');
      return;
    }

    if (adminSettings.newPassword !== adminSettings.confirmPassword) {
      alert('New passwords do not match.');
      return;
    }

    if (adminSettings.newPassword.length < 6) {
      alert('New password must be at least 6 characters long.');
      return;
    }

    try {
      setSettingsLoading(true);
      
      const result = await adminAPI.changePassword({
        currentPassword: adminSettings.currentPassword,
        newPassword: adminSettings.newPassword,
        confirmPassword: adminSettings.confirmPassword
      });

      if (result.success) {
        alert('Password changed successfully!');
        // Clear password fields
        setAdminSettings({
          ...adminSettings,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        alert(result.message || 'Failed to change password. Please try again.');
      }
    } catch (error) {
      console.error('Password change error:', error);
      alert('An error occurred while changing the password. Please try again.');
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!adminSettings.name || !adminSettings.email) {
      alert('Please fill in name and email fields.');
      return;
    }

    try {
      setSettingsLoading(true);
      
      const result = await adminAPI.updateProfile({
        name: adminSettings.name,
        email: adminSettings.email
      });

      if (result.success) {
        alert('Profile updated successfully!');
      } else {
        alert(result.message || 'Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      alert('An error occurred while updating the profile. Please try again.');
    } finally {
      setSettingsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-300 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-accent-orange mb-3">Admin: Manage Tracking Orders</h1>
        <p className="text-gray-600 text-lg">Complete cargo management system with professional tools</p>
      </div>

      {/* View Toggle */}
      <div className="mb-8">
        <div className="bg-primary-white rounded-xl shadow-sm border border-gray-200 p-2 inline-flex">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`px-6 py-3 rounded-lg transition-all duration-200 font-medium ${
              activeView === 'dashboard'
                ? 'bg-gradient-to-r from-smoke-dark to-accent-orange-hover text-white shadow-lg transform scale-105'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <span className="mr-2">📊</span>
            Dashboard Overview
          </button>
          <button
            onClick={() => setActiveView('orders')}
            className={`px-6 py-3 rounded-lg transition-all duration-200 font-medium ${
              activeView === 'orders'
                ? 'bg-gradient-to-r from-smoke-dark to-accent-orange-hover text-white shadow-lg transform scale-105'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <span className="mr-2">📦</span>
            Orders Management
          </button>
          <button
            onClick={() => setActiveView('settings')}
            className={`px-6 py-3 rounded-lg transition-all duration-200 font-medium ${
              activeView === 'settings'
                ? 'bg-gradient-to-r from-smoke-dark to-accent-orange-hover text-white shadow-lg transform scale-105'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <span className="mr-2">⚙️</span>
            Settings
          </button>
        </div>
      </div>

      {/* Dashboard View */}
      {activeView === 'dashboard' && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-primary-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Orders</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
                  <p className="text-xs text-green-600 mt-1">↗ All time</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-smoke-medium to-primary-blue rounded-xl">
                  <span className="text-3xl">📦</span>
                </div>
              </div>
            </div>

            <div className="bg-primary-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">In Transit</p>
                  <p className="text-3xl font-bold text-accent-orange">{stats.inTransit}</p>
                  <p className="text-xs text-accent-orange mt-1">↗ Active shipments</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-smoke-medium to-primary-blue rounded-xl">
                  <span className="text-3xl">🚚</span>
                </div>
              </div>
            </div>

            <div className="bg-primary-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Delivered Today</p>
                  <p className="text-3xl font-bold text-green-600">{stats.deliveredToday}</p>
                  <p className="text-xs text-green-600 mt-1">✅ Completed</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-xl">
                  <span className="text-3xl">✅</span>
                </div>
              </div>
            </div>

            <div className="bg-primary-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Delayed/Urgent</p>
                  <p className="text-3xl font-bold text-red-600">{stats.delayedOrUrgent}</p>
                  <p className="text-xs text-red-600 mt-1">⚠️ Needs attention</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-red-100 to-red-200 rounded-xl">
                  <span className="text-3xl">⚠️</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Distribution Chart */}
          <div className="bg-primary-white rounded-xl shadow-lg p-8 border border-gray-100 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">📊</span>
              Status Distribution
            </h3>
            <div className="space-y-4">
              {Object.entries(stats.statusDistribution).map(([status, count]) => (
                <div key={status} className="group hover:bg-gray-50 p-3 rounded-lg transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">{getStatusIcon(status)}</span>
                      <span className="capitalize font-semibold text-gray-800">{status.replace('-', ' ')}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-600 font-medium">{count} orders</span>
                      <div className="w-24 bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-smoke-light0 to-smoke-dark h-3 rounded-full transition-all duration-500" 
                          style={{ width: `${(count / stats.totalOrders) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500 w-12">
                        {Math.round((count / stats.totalOrders) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Login Credentials Info */}
          <div className="bg-gradient-to-br from-smoke-light to-smoke-medium rounded-xl shadow-lg p-8 border border-smoke-medium mb-8">
            <h3 className="text-xl font-bold text-smoke-darker mb-6 flex items-center">
              <span className="mr-3">🔑</span>
              Admin Login Credentials
            </h3>
            <div className="bg-primary-white rounded-lg p-6 border border-smoke-medium">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <div className="flex items-center bg-gray-50 rounded-lg p-3">
                      <span className="text-accent-orange mr-3">📧</span>
                      <span className="font-mono text-gray-800">info@cargocapital.com</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                    <div className="flex items-center bg-gray-50 rounded-lg p-3">
                      <span className="text-accent-orange mr-3">🔒</span>
                      <span className="font-mono text-gray-800">password123</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-smoke-dark to-accent-orange-hover rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                      CC
                    </div>
                    <p className="text-gray-700 font-medium">Admin Panel Access</p>
                    <p className="text-sm text-gray-500">Use these credentials to login</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <span className="font-semibold">⚠️ Security Note:</span> 
                  For production use, please change the default password in Settings.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Orders Management View */}
      {activeView === 'orders' && (
        <>
          {/* Controls */}
          <div className="bg-primary-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by Tracking ID or Customer..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-orange focus:border-smoke-light0 transition-all duration-200 bg-gray-50 focus:bg-primary-white w-full sm:w-80"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <span className="text-gray-400">🔍</span>
                  </div>
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-orange focus:border-smoke-light0 transition-all duration-200 bg-gray-50 focus:bg-primary-white"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">📋 Pending</option>
                  <option value="processing">⏳ Processing</option>
                  <option value="in-transit">🚚 In Transit</option>
                  <option value="out-for-delivery">🚛 Out for Delivery</option>
                  <option value="delivered">✅ Delivered</option>
                  <option value="cancelled">❌ Cancelled</option>
                </select>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-smoke-dark to-accent-orange-hover text-white px-6 py-3 rounded-xl hover:from-accent-orange-hover hover:to-accent-orange-hover transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
              >
                <span className="text-lg">+</span>
                <span>Add New Order</span>
              </button>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-primary-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-accent-orange uppercase tracking-wider">Tracking ID</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-accent-orange uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-accent-orange uppercase tracking-wider">Origin</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-accent-orange uppercase tracking-wider">Destination</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-accent-orange uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-accent-orange uppercase tracking-wider">Est. Delivery</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-accent-orange uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-primary-white divide-y divide-gray-100">
                  {filteredOrders.map((order, index) => (
                    <tr key={order.trackingId} className={`hover:bg-smoke-light transition-colors ${index % 2 === 0 ? 'bg-primary-white' : 'bg-gray-50'}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-accent-orange font-bold text-lg">{order.trackingId}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{order.customerInfo.name}</div>
                          <div className="text-sm text-gray-500">{order.customerInfo.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-accent-orange">
                        {order.shipmentDetails.origin}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-accent-orange">
                        {order.shipmentDetails.destination}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          key={`status-${order.trackingId}-${order.status}`}
                          value={order.status || 'processing'}
                          onChange={(e) => {
                            e.preventDefault();
                            handleStatusUpdate(order.trackingId, e.target.value);
                          }}
                          className={`w-full px-3 py-2 text-sm font-semibold rounded-lg border-0 cursor-pointer ${getStatusColor(order.status)} hover:shadow-md transition-all appearance-none`}
                          style={{ minWidth: '150px' }}
                        >
                          <option value="processing">⏳ Processing</option>
                          <option value="picked-up">📦 Picked Up</option>
                          <option value="in-transit">🚚 In Transit</option>
                          <option value="out-for-delivery">🚛 Out for Delivery</option>
                          <option value="delivered">✅ Delivered</option>
                          <option value="failed-delivery">❌ Failed Delivery</option>
                          <option value="returned">↩️ Returned</option>
                          <option value="cancelled">🚫 Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {(() => {
                          const ed = resolveEstimatedDelivery(order);
                          return ed ? new Date(ed).toLocaleDateString() : 'N/A';
                        })()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap space-x-2">
                        <button
                          onClick={() => {
                            setEditingOrder(order);
                            setShowEditModal(true);
                          }}
                          className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.trackingId)}
                          className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <span className="text-4xl">📦</span>
                <p className="mt-2 text-gray-500">No orders found</p>
                <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Settings View */}
      {activeView === 'settings' && (
        <div className="space-y-8">
          {/* Profile Settings */}
          <div className="bg-primary-white rounded-xl shadow-lg border border-gray-100 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">👤</span>
              Profile Settings
            </h3>
            
            <form className="space-y-6" onSubmit={handleProfileUpdate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={adminSettings.name}
                    onChange={(e) => setAdminSettings({...adminSettings, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-orange focus:border-smoke-light0 transition-all duration-200"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={adminSettings.email}
                    onChange={(e) => setAdminSettings({...adminSettings, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-orange focus:border-smoke-light0 transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={settingsLoading}
                  className="px-6 py-3 bg-gradient-to-r from-smoke-dark to-accent-orange-hover text-white rounded-xl hover:from-accent-orange-hover hover:to-accent-orange-hover transition-all duration-200 shadow-lg disabled:opacity-50"
                >
                  {settingsLoading ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </form>
          </div>

          {/* Password Change */}
          <div className="bg-primary-white rounded-xl shadow-lg border border-gray-100 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">🔒</span>
              Change Password
            </h3>
            
            <form className="space-y-6" onSubmit={handlePasswordChange}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={adminSettings.currentPassword}
                    onChange={(e) => setAdminSettings({...adminSettings, currentPassword: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-orange focus:border-smoke-light0 transition-all duration-200"
                    placeholder="Enter current password"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={adminSettings.newPassword}
                      onChange={(e) => setAdminSettings({...adminSettings, newPassword: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-orange focus:border-smoke-light0 transition-all duration-200"
                      placeholder="Enter new password"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={adminSettings.confirmPassword}
                      onChange={(e) => setAdminSettings({...adminSettings, confirmPassword: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-orange focus:border-smoke-light0 transition-all duration-200"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setAdminSettings({...adminSettings, currentPassword: '', newPassword: '', confirmPassword: ''})}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  disabled={settingsLoading}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg disabled:opacity-50"
                >
                  {settingsLoading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>

          {/* System Preferences */}
          <div className="bg-primary-white rounded-xl shadow-lg border border-gray-100 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">⚙️</span>
              System Preferences
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h4 className="font-semibold text-gray-900">Email Notifications</h4>
                  <p className="text-sm text-gray-600">Receive email alerts for important events</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={adminSettings.notifications}
                    onChange={(e) => setAdminSettings({...adminSettings, notifications: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-orange rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-primary-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-smoke-dark"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h4 className="font-semibold text-gray-900">Dark Mode</h4>
                  <p className="text-sm text-gray-600">Switch to dark theme (Coming Soon)</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={adminSettings.darkMode}
                    onChange={(e) => setAdminSettings({...adminSettings, darkMode: e.target.checked})}
                    className="sr-only peer"
                    disabled
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-orange rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-primary-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-smoke-dark opacity-50"></div>
                </label>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">Auto Logout</h4>
                    <p className="text-sm text-gray-600">Automatically logout after inactivity</p>
                  </div>
                  <select
                    value={adminSettings.autoLogout}
                    onChange={(e) => setAdminSettings({...adminSettings, autoLogout: parseInt(e.target.value)})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-smoke-light0"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={120}>2 hours</option>
                    <option value={0}>Never</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Security Info */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-lg border border-yellow-200 p-8">
            <h3 className="text-xl font-bold text-smoke-darker mb-6 flex items-center">
              <span className="mr-3">🔒</span>
              Security Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-primary-white rounded-lg p-4 border border-yellow-200">
                <h4 className="font-semibold text-gray-900 mb-2">Last Login</h4>
                <p className="text-sm text-gray-600">{new Date().toLocaleString()}</p>
              </div>
              
              <div className="bg-primary-white rounded-lg p-4 border border-yellow-200">
                <h4 className="font-semibold text-gray-900 mb-2">Session Status</h4>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <p className="text-sm text-gray-600">Active</p>
                </div>
              </div>
              
              <div className="bg-primary-white rounded-lg p-4 border border-yellow-200">
                <h4 className="font-semibold text-gray-900 mb-2">IP Address</h4>
                <p className="text-sm text-gray-600">192.168.1.100</p>
              </div>
              
              <div className="bg-primary-white rounded-lg p-4 border border-yellow-200">
                <h4 className="font-semibold text-gray-900 mb-2">Browser</h4>
                <p className="text-sm text-gray-600">{navigator.userAgent.split(' ')[0]}</p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-semibold text-red-900 mb-2">⚠️ Security Recommendations</h4>
              <ul className="text-sm text-red-800 space-y-1">
                <li>• Change default password immediately</li>
                <li>• Use a strong password with special characters</li>
                <li>• Enable two-factor authentication (Coming Soon)</li>
                <li>• Regular security audits recommended</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Add Order Modal */}
      {showAddModal && <AddOrderModal />}
      
      {/* Edit Order Modal */}
      {showEditModal && <EditOrderModal />}
    </div>
  );
};

export default UnifiedAdminPanel;
