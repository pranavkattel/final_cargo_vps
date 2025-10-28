import React, { useState, useEffect } from 'react';
import AdminNav from '../components/AdminNav';
import { adminAPI, AdminUser as AdminUserType } from '../services/trackingService';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin';
  avatar?: string;
}

interface AdminAppProps {
  onLogout?: () => void;
  initialUser?: AdminUser;
}

const AdminApp: React.FC<AdminAppProps> = ({ 
  onLogout,
  initialUser 
}) => {
  const [currentUser, setCurrentUser] = useState<AdminUser>(
    initialUser || {
      id: '1',
      name: 'Admin User',
  email: 'info@cargocapital.com',
      role: 'admin'
    }
  );

  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      // Check if user is authenticated
      if (adminAPI.isAuthenticated()) {
        const result = await adminAPI.verifyToken();
        if (result.success && result.data?.admin) {
          setCurrentUser({
            id: result.data.admin.id,
            name: result.data.admin.name,
            email: result.data.admin.email,
            role: result.data.admin.role
          });
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
  }, []);

  const handleLogout = async () => {
    await adminAPI.logout();
    setIsAuthenticated(false);
    if (onLogout) {
      onLogout();
    }
  };

  // Simple login form for demo purposes
  const LoginForm = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      
      try {
        const result = await adminAPI.login(credentials);
        
        if (result.success && result.data) {
          setIsAuthenticated(true);
          setCurrentUser({
            id: result.data.admin.id,
            name: result.data.admin.name,
            email: result.data.admin.email,
            role: result.data.admin.role
          });
        } else {
          alert(result.message || 'Login failed. Please check your credentials.');
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login. Please try again.');
      }
      
      setLoading(false);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6 shadow-lg">
                CC
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Cargo Capital</h1>
              <p className="text-gray-600 text-lg">Admin Panel</p>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full mx-auto mt-4"></div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={credentials.email}
                    onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="info@cargocapital.com"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <span className="text-gray-400">📧</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={credentials.password}
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter your password"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <span className="text-gray-400">🔒</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In to Admin Panel'
                )}
              </button>
            </form>

            {/* NOTE: Public demo credentials removed for security.
                Use the admin-update script on the backend to create or update
                the admin user, or contact the site administrator for access. */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                <div className="text-sm text-yellow-800">
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-600 mr-2">⚠️</span>
                    <p className="font-semibold">Admin Access</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-yellow-200">
                    <p className="text-gray-700">Demo credentials have been removed from the public UI for security. If you need access, please run the backend admin-update script or contact the administrator.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                🔒 Secure admin access • Demo environment
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="h-screen overflow-hidden">
      <AdminNav 
        currentUser={currentUser}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default AdminApp;
