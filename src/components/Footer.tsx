import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import logo from '../assets/images/logo.png';

const Footer = () => {
  return (
    <footer className="text-white w-full" style={{ backgroundColor: '#0096C7' }}>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <img 
                src={logo} 
                alt="Capital Cargo Logo" 
                className="h-16 max-w-full object-contain" 
                loading="lazy"
              />
            </div>
            <p className="text-gray-200 text-sm">
              Connecting Nepal to the world with reliable, efficient, and secure cargo services. 
              Your trusted partner for international logistics.
            </p>
            <div className="flex justify-center space-x-5">
              <a
                href="https://www.facebook.com/CapitalCargoNepal/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Capital Cargo on Facebook"
                className="text-gray-300 transition-transform duration-200 hover:scale-110 hover:text-white"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="https://www.instagram.com/capitalcargonepal/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Capital Cargo on Instagram"
                className="text-gray-300 transition-transform duration-200 hover:scale-110 hover:text-white"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="https://www.linkedin.com/company/ccipl-npl/?originalSubdomain=np"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Capital Cargo on LinkedIn"
                className="text-gray-300 transition-transform duration-200 hover:scale-110 hover:text-white"
              >
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/about" className="block text-gray-200 hover:text-white transition-colors text-sm">About Us</Link>
              <Link to="/services" className="block text-gray-200 hover:text-white transition-colors text-sm">Services</Link>
              <Link to="/tracking" className="block text-gray-200 hover:text-white transition-colors text-sm">Track Cargo</Link>
              <Link to="/quote" className="block text-gray-200 hover:text-white transition-colors text-sm">Get Quote</Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Our Services</h3>
            <div className="space-y-2">
              <p className="text-gray-200 text-sm">Air Cargo</p>
              <p className="text-gray-200 text-sm">Sea Freight</p>
              <p className="text-gray-200 text-sm">Land Transport</p>
              <p className="text-gray-200 text-sm">Customs Clearance</p>
              <p className="text-gray-200 text-sm">Door-to-Door</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-3">
                <MapPin className="h-4 w-4 flex-shrink-0" style={{ color: '#F9B222' }} />
                <span className="text-gray-200 text-sm">Thamel, Kathmandu, Nepal</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Phone className="h-4 w-4 flex-shrink-0" style={{ color: '#F9B222' }} />
                <span className="text-gray-200 text-sm">+977-01-5367883, 01-5368837</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Mail className="h-4 w-4 flex-shrink-0" style={{ color: '#F9B222' }} />
                <span className="text-gray-200 text-sm">info@cargocapital.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-blue mt-8 pt-8 text-center">
          <p className="text-gray-300 text-sm">
            © 2024 Capital Cargo International Pvt. Ltd. All rights reserved. | Connecting Nepal to the World
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
