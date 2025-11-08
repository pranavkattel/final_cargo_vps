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
      features: ['Priority delivery', 'Real-time tracking', 'Secure handling'],
      image: 'https://images.pexels.com/photos/62623/wing-plane-flying-airplane-62623.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      icon: Ship,
      title: 'Sea Freight & Ocean Shipping',
      description: 'Top-rated sea freight forwarding services in Nepal',
      features: ['Bulk shipping', 'Container services', 'Port-to-port delivery'],
      image: 'https://images.pexels.com/photos/906982/pexels-photo-906982.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      icon: Truck,
      title: 'Land Transport & Logistics',
      description: 'Reliable cargo transport across Nepal and borders',
      features: ['Cross-border delivery', 'Flexible scheduling', 'Last-mile precision'],
      image: 'https://images.pexels.com/photos/1095814/pexels-photo-1095814.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      icon: DoorOpen,
      title: 'Door-to-Door Delivery',
      description: 'Complete cargo solutions from pickup to delivery',
      features: ['Easy pickup', 'Direct delivery', 'Stress-free'],
      image: 'https://images.pexels.com/photos/4481532/pexels-photo-4481532.jpeg?auto=compress&cs=tinysrgb&w=800'
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
    <div>
      {/* SEO Content - Hidden but crawlable */}
      <div className="sr-only">
        <h1>Capital Cargo - #1 Best Cargo Company in Nepal</h1>
        <p>Capital Cargo is Nepal's leading cargo company and top-rated logistics service provider based in Kathmandu. As the #1 freight forwarding company in Nepal, we offer best international shipping, air freight services, sea freight, and reliable cargo delivery across Nepal and worldwide. Trusted by thousands for import-export cargo solutions.</p>
        <p>Services: Best air freight company Nepal, top cargo shipping, international shipping Nepal, freight forwarding services, logistics and cargo transport, import export services, door-to-door delivery Kathmandu</p>
      </div>
      
      {/* Hero Section - Bigger for Video Background */}
      <section className="relative text-white min-h-[85vh] flex items-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #0096C7 0%, #007bb3 100%)' }}>
        {/* Video Background Placeholder - You can add video element here */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900"></div>
          {/* Future: Add <video> element here */}
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Nepal's #1 Best Cargo & <span style={{ color: '#F9B222' }}>Logistics Company</span>
              </h1>
              <p className="text-2xl text-blue-100 leading-relaxed">
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

      {/* About Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#0096C7' }}>
                About Capital Cargo
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Established in 1998, Capital Cargo has been Nepal's most trusted logistics and freight forwarding company for over 27 years. We are headquartered in Kathmandu and specialize in international cargo shipping, connecting Nepali businesses with global markets.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                As Nepal's #1 cargo company, we handle everything from small parcels to large commercial shipments across 110+ countries worldwide. Our expertise spans air freight, sea freight, land transport, and door-to-door delivery services.
              </p>
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                  <div className="text-3xl font-bold mb-2" style={{ color: '#0096C7' }}>27+</div>
                  <div className="text-gray-700 font-medium">Years Experience</div>
                </div>
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                  <div className="text-3xl font-bold mb-2" style={{ color: '#0096C7' }}>110+</div>
                  <div className="text-gray-700 font-medium">Countries Served</div>
                </div>
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                  <div className="text-3xl font-bold mb-2" style={{ color: '#0096C7' }}>50K+</div>
                  <div className="text-gray-700 font-medium">Happy Customers</div>
                </div>
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                  <div className="text-3xl font-bold mb-2" style={{ color: '#0096C7' }}>1M+</div>
                  <div className="text-gray-700 font-medium">Packages Delivered</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"
                alt="About Capital Cargo Nepal"
                className="rounded-2xl shadow-2xl object-cover w-full h-[500px]"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl">
                <div className="flex items-center space-x-4">
                  <Award className="h-12 w-12" style={{ color: '#F9B222' }} />
                  <div>
                    <div className="font-bold text-gray-900">ISO Certified</div>
                    <div className="text-sm text-gray-600">Quality Assured</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Location Map Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#0096C7' }}>
              Visit Our Office
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find us in the heart of Thamel, Kathmandu - Easy access for all your cargo needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Google Maps Embed */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.0726203098875!2d85.31065731506217!3d27.715383582790384!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb18fdefffffff%3A0x5f006508519ddb86!2sThamel%2C%20Kathmandu%2044600!5e0!3m2!1sen!2snp!4v1699999999999!5m2!1sen!2snp"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Capital Cargo Office Location"
              ></iframe>
            </div>

            {/* Contact Information Card */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col justify-center">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: '#0096C7' }}>
                    Capital Cargo Nepal
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Located in the bustling heart of Thamel, our office provides easy access for all your international cargo and shipping needs.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="rounded-full p-3 mt-1" style={{ backgroundColor: '#F9B222' }}>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
                      <p className="text-gray-600">Thamel, Kathmandu, Nepal</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="rounded-full p-3 mt-1" style={{ backgroundColor: '#F9B222' }}>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                      <p className="text-gray-600">+977-01-5367883</p>
                      <p className="text-gray-600">01-5368837</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="rounded-full p-3 mt-1" style={{ backgroundColor: '#F9B222' }}>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Office Hours</h4>
                      <p className="text-gray-600">Sunday - Friday: 10:00 AM - 5:00 PM</p>
                      <p className="text-gray-600">Saturday: Closed</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="rounded-full p-3 mt-1" style={{ backgroundColor: '#F9B222' }}>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                      <p className="text-gray-600">info@cargocapital.com</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center w-full px-6 py-3 text-lg font-semibold text-white rounded-lg transition-all duration-300 hover:scale-105"
                    style={{ backgroundColor: '#F9B222' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6a01e'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F9B222'}
                  >
                    Get Directions
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#0096C7' }}>
              Why Choose Capital Cargo?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine 27 years of expertise with modern technology to deliver excellence
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="rounded-full p-4 mb-4 w-fit" style={{ backgroundColor: '#F9B222' }}>
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#0096C7' }}>Expert Knowledge</h3>
              <p className="text-gray-700">27+ years of experience in international logistics and deep understanding of Nepali markets and customs procedures.</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="rounded-full p-4 mb-4 w-fit" style={{ backgroundColor: '#F9B222' }}>
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#0096C7' }}>Secure & Reliable</h3>
              <p className="text-gray-700">Advanced tracking systems, comprehensive insurance options, and secure packaging to ensure your cargo reaches safely.</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="rounded-full p-4 mb-4 w-fit" style={{ backgroundColor: '#F9B222' }}>
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#0096C7' }}>On-Time Delivery</h3>
              <p className="text-gray-700">Committed to meeting delivery schedules with 99.9% on-time performance rate across all shipping methods.</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="rounded-full p-4 mb-4 w-fit" style={{ backgroundColor: '#F9B222' }}>
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#0096C7' }}>Global Network</h3>
              <p className="text-gray-700">Extensive network covering 110+ countries with trusted airline and shipping partners worldwide.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
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
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 rounded-full p-3 w-fit" style={{ backgroundColor: '#F9B222', color: 'white' }}>
                    <service.icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="p-6">
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
              </div>
            ))}
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