import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Tracking from './pages/Tracking';
import Quote from './pages/Quote';
import FAQ from './pages/FAQ';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import AdminTracking from './pages/AdminTracking';
import AdminTest from './pages/AdminTest';
import TestAPI from './pages/TestAPI';
import AdminApp from './pages/AdminApp';
import UnifiedAdminPanel from './pages/UnifiedAdminPanel';
import DataTools from './pages/DataTools';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/tracking" element={<Tracking />} />
            <Route path="/quote" element={<Quote />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<AdminTracking />} />
            <Route path="/admin-panel" element={<AdminApp />} />
            <Route path="/admin-unified" element={<UnifiedAdminPanel />} />
            <Route path="/admin-tools" element={<DataTools />} />
            <Route path="/admin-test" element={<AdminTest />} />
            <Route path="/test-api" element={<TestAPI />} />
          </Routes>
        </main>
  <Footer />
      </div>
    </Router>
  );
}

export default App;