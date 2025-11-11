import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import logo from '../assets/images/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
   
    { name: 'Tracking', href: '/tracking' },
    { name: 'Quote', href: '/quote' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="bg-primary-white shadow-lg sticky top-0 z-50 transition-all duration-300 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20">
          {/* Company Logo - Far Left */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center group">
              <img 
                src={logo} 
                alt="Capital Cargo Logo" 
                className="h-20 transition-all duration-300 group-hover:scale-105" 
              />
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex flex-1 justify-center">
            <div className="flex items-center space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 group ${
                    location.pathname === item.href
                      ? 'border-b-2'
                      : 'hover:scale-105'
                  }`}
                  style={{
                    color: location.pathname === item.href ? '#718096' : '#2D3748',
                    borderColor: location.pathname === item.href ? '#718096' : 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (location.pathname !== item.href) {
                      e.currentTarget.style.color = '#718096';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== item.href) {
                      e.currentTarget.style.color = '#2D3748';
                    }
                  }}
                >
                  {item.name}
                  {/* Hover underline effect */}
                  <span 
                    className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                      location.pathname === item.href ? 'hidden' : ''
                    }`}
                    style={{ backgroundColor: '#718096' }}
                  ></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Number - Far Right */}
          <div className="hidden lg:flex flex-shrink-0">
            <div 
              className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer group" 
              style={{ color: '#718096' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <Phone className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
              <span className="text-sm font-medium">+977-01-5367883, 01-5368837</span>
            </div>
          </div>

          {/* Mobile menu button - Far Right on mobile */}
          <div className="lg:hidden flex items-center ml-auto">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95"
              style={{ color: '#2D3748' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
                e.currentTarget.style.color = '#718096';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#2D3748';
              }}
            >
              <div className="relative w-6 h-6">
                <Menu 
                  className={`absolute inset-0 transition-all duration-300 ${
                    isOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'
                  }`} 
                />
                <X 
                  className={`absolute inset-0 transition-all duration-300 ${
                    isOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
                  }`} 
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={`lg:hidden bg-primary-white border-t border-gray-200 transition-all duration-300 ease-in-out w-full ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navigation.map((item, index) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 text-base font-medium rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                location.pathname === item.href
                  ? 'shadow-md'
                  : 'hover:shadow-sm'
              }`}
              style={{
                color: location.pathname === item.href ? '#718096' : '#2D3748',
                backgroundColor: location.pathname === item.href ? '#f0f0f0' : 'transparent',
                transitionDelay: `${index * 50}ms`,
                transform: isOpen ? 'translateX(0)' : 'translateX(-20px)',
                opacity: isOpen ? 1 : 0
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== item.href) {
                  e.currentTarget.style.backgroundColor = '#f0f0f0';
                  e.currentTarget.style.color = '#718096';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== item.href) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#2D3748';
                }
              }}
            >
              {item.name}
            </Link>
          ))}
          <div 
            className="px-3 py-2 flex items-center space-x-2 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer group" 
            style={{ 
              color: '#718096',
              transitionDelay: `${navigation.length * 50}ms`,
              transform: isOpen ? 'translateX(0)' : 'translateX(-20px)',
              opacity: isOpen ? 1 : 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f0f0f0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Phone className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
            <span className="text-sm font-medium">+977-01-5367883, 01-5368837</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
