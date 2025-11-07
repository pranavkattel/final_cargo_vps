import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Package, Plane, Ship, Truck, Shield, Clock, Globe, CheckCircle, Star, Users, Award, DoorOpen } from 'lucide-react';
import Globe3D from '../components/Globe3D';

const Home = () => {
  const services = [
    {
      icon: Plane,
      title: 'Air Freight Services',
      description: 'Best air cargo company in Nepal - Fast international shipping',
      features: ['Priority delivery', 'Real-time tracking', 'Secure handling']
    },
    {
      icon: Ship,
      title: 'Sea Freight & Ocean Shipping',
      description: 'Top-rated sea freight forwarding services in Nepal',
      features: ['Bulk shipping', 'Container services', 'Port-to-port delivery']
    },
    {
      icon: Truck,
      title: 'Land Transport & Logistics',
      description: 'Reliable cargo transport across Nepal and borders',
      features: ['Cross-border delivery', 'Flexible scheduling', 'Last-mile precision']
    },
    {
      icon: DoorOpen,
      title: 'Door-to-Door Delivery',
      description: 'Complete cargo solutions from pickup to delivery',
      features: ['Easy pickup', 'Direct delivery', 'Stress-free']
    }
  ];

  const stats = [
    { icon: Package, number: '1,000,000+', label: 'Packages Delivered' },
    { icon: Globe, number: '110+', label: 'Countries Served' },
    { icon: Users, number: '50,000+', label: 'Happy Customers' },
    { icon: Award, number: '27+', label: 'Years Experience' }
  ];

  const testimonials = [
    {
      name: '– Mr. Scepi Demory',
      
      text: 'I have received all goods. Everything is perfect. Thank you to all of the team for the work realized.',
      rating: 5
    },
    {
      name: '– Mr. Damien Therrian',
      
      text: 'The shipment has arrived safely. Thank you for all of your help and also for an excellent packing job!',
      rating: 5
    },
    {
      name: '– Mr. Jonathan Hansard',
      
      text: 'Thank you very much. It has been a pleasure working with you and your staff. I look forward to doing more business with you.',
      rating: 5
    },
    {
      name: '- Mr. Alex Jackson',
      
      text: 'Brilliant service from Capital. I use all the time for heavy, valuable cargo from Nepal to UK. Only 1 week to 10 days tracked delivery to my door from Nepal. Reliable service and customer service is excellent. Thank you!',
      rating: 5
    }
  ];

  return (
    <div className="pt-16">
      {/* SEO Content - Hidden but crawlable */}
      <div className="sr-only">
        <h1>Capital Cargo - #1 Best Cargo Company in Nepal</h1>
        <p>Capital Cargo is Nepal's leading cargo company and top-rated logistics service provider based in Kathmandu. As the #1 freight forwarding company in Nepal, we offer best international shipping, air freight services, sea freight, and reliable cargo delivery across Nepal and worldwide. Trusted by thousands for import-export cargo solutions.</p>
        <p>Services: Best air freight company Nepal, top cargo shipping, international shipping Nepal, freight forwarding services, logistics and cargo transport, import export services, door-to-door delivery Kathmandu</p>
      </div>
      
      {/* Hero Section */}
      <section className="relative text-white py-16 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0096C7 0%, #007bb3 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                Nepal's #1 Best Cargo & <span style={{ color: '#F9B222' }}>Logistics Company</span>
              </h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Top-rated international shipping and freight forwarding services in Kathmandu. 
                Trusted cargo delivery company offering air freight, sea freight, and reliable logistics solutions across Nepal and worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/quote"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  style={{ backgroundColor: '#F9B222' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6a01e'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F9B222'}
                >
                  Get Instant Quote
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link 
                  to="/tracking"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg border-2 border-white text-white hover:bg-white transition-all duration-300"
                  style={{ ':hover': { color: '#0096C7' } }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.color = '#0096C7';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'white';
                  }}
                >
                  Track Cargo
                </Link>
              </div>
            </div>
            <div
              className="relative flex justify-center items-center"
              style={{
                overflow: 'visible',
                minHeight: 0,
                height: 'auto',
                width: '100%',
                zIndex: 2,
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  minWidth: 0,
                  minHeight: 0,
                  maxWidth: 'none',
                  maxHeight: 'none',
                  overflow: 'visible',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'none',
                  pointerEvents: 'auto',
                }}
              >
                <Globe3D />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0096C7' }}>
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive logistics solutions tailored for Nepali businesses and international trade
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
                <div className="rounded-full p-3 mb-4 w-fit" style={{ backgroundColor: '#F9B222', color: 'white' }}>
                  <service.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: '#0096C7' }}>{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 mr-2" style={{ color: '#F9B222' }} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0096C7' }}>
              Trusted by Thousands
            </h2>
            <p className="text-xl text-gray-600">
              Our numbers speak for our commitment to excellence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="rounded-full p-4 mx-auto mb-4 w-fit" style={{ backgroundColor: '#F9B222' }}>
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold mb-2" style={{ color: '#0096C7' }}>{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-8" style={{ color: '#0096C7' }}>
                Why Choose Capital Cargo?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="rounded-full p-2" style={{ backgroundColor: '#F9B222' }}>
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2" style={{ color: '#0096C7' }}>Expert Knowledge</h3>
                    <p className="text-gray-600">27+ years of experience in international logistics and deep understanding of Nepali markets.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="rounded-full p-2" style={{ backgroundColor: '#F9B222' }}>
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2" style={{ color: '#0096C7' }}>Secure & Reliable</h3>
                    <p className="text-gray-600">Advanced tracking systems and insurance options to ensure your cargo reaches safely.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="rounded-full p-2" style={{ backgroundColor: '#F9B222' }}>
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2" style={{ color: '#0096C7' }}>On-Time Delivery</h3>
                    <p className="text-gray-600">Committed to meeting delivery schedules with 99.9% on-time performance rate.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="rounded-full p-2" style={{ backgroundColor: '#F9B222' }}>
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2" style={{ color: '#0096C7' }}>Global Network</h3>
                    <p className="text-gray-600">Extensive network covering 110+ countries with trusted partners worldwide.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              {/* Replace Globe3D with an image */}
              <img
                src="https://images.pexels.com/photos/1797428/pexels-photo-1797428.jpeg?auto=compress&fit=crop&w=800&q=80"
                alt="Why Choose NepalCargo"
                className="rounded-xl shadow-2xl object-cover w-full h-full max-h-[400px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0096C7' }}>
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600">
              Real feedback from businesses we've helped grow globally
            </p>
          </div>
          <div className="relative w-full overflow-hidden">
            <div
              className="flex items-stretch gap-8 testimonial-marquee"
              style={{
                width: 'max-content',
                animation: 'testimonial-scroll 80s linear infinite', // Slower pace
              }}
            >
              {Array(2).fill(testimonials).flat().map((testimonial, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 min-w-[350px] max-w-[350px] flex-shrink-0 mx-2">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, starIndex) => (
                      <Star key={starIndex} className="h-5 w-5 fill-current" style={{ color: '#F9B222' }} />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
                  <div>
                    <div className="font-semibold" style={{ color: '#0096C7' }}>{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.company}</div>
                  </div>
                </div>
              ))}
            </div>
            <style>
              {`
                @keyframes testimonial-scroll {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
                .testimonial-marquee {
                  will-change: transform;
                }
              `}
            </style>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-white" style={{ background: 'linear-gradient(135deg, #0096C7 0%, #007bb3 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Ship Your Cargo?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Get started with a free quote and discover how we can help your business reach global markets.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/quote"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: '#F9B222' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6a01e'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F9B222'}
            >
              Get Free Quote
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg border-2 border-white text-white hover:bg-white transition-all duration-300"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = '#0096C7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'white';
              }}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;