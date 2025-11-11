import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Plane, Ship, Truck, Shield, Clock, Globe, CheckCircle, Star, Award, DoorOpen } from 'lucide-react';
import earthTexture from '../assets/images/earth_texture.jpg';
import vid1 from '../assets/video/vid1.mp4';
import vid2 from '../assets/video/vid2.mp4';

// Lazy load Globe3D for better initial page load
const Globe3D = lazy(() => import('../components/Globe3D'));

const Home = () => {
  const heroGlobeRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoadGlobe, setShouldLoadGlobe] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const videoSources = useMemo(() => [vid1, vid2], []);
  const [activeVideo, setActiveVideo] = useState(() => videoSources[0]);

  const regionCountries: Record<string, string[]> = {
    'North America': ['United States', 'Canada', 'Mexico'],
    'South America': ['Brazil', 'Argentina', 'Chile', 'Colombia', 'Peru'],
    'Asia': ['China', 'Japan', 'South Korea', 'India', 'Singapore', 'Thailand', 'Malaysia'],
    'Oceania': ['Australia', 'New Zealand'],
    'East Asia': ['Japan', 'South Korea', 'Taiwan', 'Hong Kong'],
    'Africa': ['South Africa', 'Egypt', 'Kenya', 'Nigeria', 'Morocco'],
    'Europe': ['United Kingdom', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Belgium', 'Switzerland'],
    'Middle East': ['United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Oman'],
  };

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



  // Delay loading the heavy 3D globe until the hero is on screen and the browser is idle.
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const target = heroGlobeRef.current;
    if (!target || shouldLoadGlobe) {
      return;
    }

    let observer: IntersectionObserver | null = null;
    let idleHandle: number | undefined;
    let timeoutId: number | undefined;

    const triggerLoad = () => {
      if (shouldLoadGlobe) {
        return;
      }
      const idleCallback = (window as unknown as { requestIdleCallback?: (cb: () => void, options?: { timeout: number }) => number }).requestIdleCallback;
      if (typeof idleCallback === 'function') {
        idleHandle = idleCallback(() => setShouldLoadGlobe(true), { timeout: 800 });
      } else {
        timeoutId = window.setTimeout(() => setShouldLoadGlobe(true), 400);
      }
    };

    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            triggerLoad();
            observer?.disconnect();
          }
        });
      }, { rootMargin: '100px' });
      observer.observe(target);
    } else {
      triggerLoad();
    }

    return () => {
      observer?.disconnect();
      const cancelIdle = (window as unknown as { cancelIdleCallback?: (handle: number) => void }).cancelIdleCallback;
      if (typeof cancelIdle === 'function' && typeof idleHandle === 'number') {
        cancelIdle(idleHandle);
      }
      if (typeof timeoutId === 'number') {
        window.clearTimeout(timeoutId);
      }
    };
  }, [shouldLoadGlobe]);

  return (
    <div>
      {/* SEO Content - Hidden but crawlable */}
      <div className="sr-only">
        <h1>Capital Cargo - #1 Best Cargo Company in Nepal</h1>
        <p>Capital Cargo is Nepal's leading cargo company and top-rated logistics service provider based in Kathmandu. As the #1 freight forwarding company in Nepal, we offer best international shipping, air freight services, sea freight, and reliable cargo delivery across Nepal and worldwide. Trusted by thousands for import-export cargo solutions.</p>
        <p>Services: Best air freight company Nepal, top cargo shipping, international shipping Nepal, freight forwarding services, logistics and cargo transport, import export services, door-to-door delivery Kathmandu</p>
      </div>
      
      {/* Hero Section - Earth Texture with Clickable Points */}
      <section className="relative text-white min-h-[70vh] flex items-center overflow-hidden">
        {/* Earth texture background */}
        <div className="absolute inset-0">
          <img
            src={earthTexture}
            alt="Earth"
            className="absolute inset-0 h-full w-full object-fill animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50"></div>
          
          {/* Animated grid overlay for cargo tech feel */}
          <div className="absolute inset-0 opacity-10" 
               style={{
                 backgroundImage: 'linear-gradient(rgba(113,128,150,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(113,128,150,0.5) 1px, transparent 1px)',
                 backgroundSize: '50px 50px'
               }}>
          </div>
          
          {/* Animated corner accents */}
          <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-accent-orange animate-pulse"></div>
          <div className="absolute top-0 right-0 w-32 h-32 border-t-4 border-r-4 border-accent-orange animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 border-b-4 border-l-4 border-accent-orange animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-accent-orange animate-pulse"></div>

          {/* Clickable animated location points overlay */}
          <div className="absolute inset-0">
            {[
              { top: '30%', left: '21%', delay: '0s', label: 'North America' },
              { top: '55%', left: '32%', delay: '0.5s', label: 'South America' },
              { top: '35%', left: '75%', delay: '1s', label: 'Asia' },
              { top: '68%', left: '88%', delay: '1.5s', label: 'Oceania' },
              { top: '32%', left: '89%', delay: '2s', label: 'East Asia' },
              { top: '42%', left: '55%', delay: '2.5s', label: 'Africa' },
              { top: '24%', left: '57%', delay: '3s', label: 'Europe' },
              { top: '38%', left: '63%', delay: '3.5s', label: 'Middle East' },
            ].map((point, index) => (
              <div
                key={index}
                className="absolute group cursor-pointer animate-pulse hover:animate-none transition-all duration-300 z-10"
                style={{
                  top: point.top,
                  left: point.left,
                  animationDelay: point.delay,
                }}
                onClick={() => setSelectedRegion(selectedRegion === point.label ? null : point.label)}
              >
                <div className="relative">
                  {/* Main Point */}
                  <div className="w-6 h-6 bg-accent-orange rounded-full opacity-90 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300 shadow-lg border-2 border-white"></div>
                  
                  {/* Pulsing Ring */}
                  <div className="absolute inset-0 w-6 h-6 bg-accent-orange rounded-full animate-ping opacity-30 group-hover:opacity-50"></div>
                  
                  {/* Outer Glow */}
                  <div className="absolute inset-0 w-6 h-6 bg-accent-orange rounded-full blur-sm opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 translate-y-full px-3 py-1.5 bg-white text-smoke-dark text-xs font-semibold rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-lg border border-accent-orange">
                    {point.label}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-white"></div>
                  </div>

                  {/* Country Dropdown */}
                  {selectedRegion === point.label && (
                    <div 
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 bg-white rounded-xl shadow-2xl p-4 min-w-[240px] max-h-[320px] overflow-hidden border border-gray-100 z-[9999] animate-fade-in"
                      style={{
                        backdropFilter: 'blur(10px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.98)',
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-between items-center mb-3 pb-3 border-b-2 border-gradient-to-r from-accent-orange to-transparent">
                        <h4 className="font-bold text-smoke-dark text-base flex items-center gap-2">
                          <span className="text-accent-orange">📍</span>
                          {point.label}
                        </h4>
                        <button 
                          onClick={() => setSelectedRegion(null)}
                          className="text-gray-400 hover:text-accent-orange text-2xl leading-none transition-colors duration-200 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100"
                        >
                          ×
                        </button>
                      </div>
                      <div className="space-y-1 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
                        {regionCountries[point.label]?.map((country, idx) => (
                          <Link
                            key={idx}
                            to={`/quote?destination=${encodeURIComponent(country)}`}
                            className="block px-4 py-2.5 rounded-lg text-sm transition-all duration-200 hover:bg-gradient-to-r hover:from-accent-orange hover:to-orange-500 hover:text-white text-smoke-dark font-medium hover:shadow-md hover:scale-[1.02] transform group"
                          >
                            <span className="flex items-center gap-2">
                              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">✈️</span>
                              {country}
                            </span>
                          </Link>
                        ))}
                      </div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-white" style={{ filter: 'drop-shadow(0 -2px 2px rgba(0,0,0,0.05))' }}></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top text overlay with animations */}
        <div className="absolute top-0 left-0 right-0 z-10 pt-12 pointer-events-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {/* Animated shipping icon */}
              <div className="inline-block mb-4 animate-bounce">
                <svg className="w-16 h-16 mx-auto text-accent-orange" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                </svg>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold leading-tight animate-fade-in" 
                  style={{
                    animation: 'fadeInDown 1s ease-out',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                  }}>
                Ship Anywhere in the <span style={{ color: '#718096' }} className="animate-pulse">World</span>
              </h2>
              {/* Decorative lines */}
              <div className="flex items-center justify-center gap-4 mt-4">
                <div className="h-0.5 w-16 bg-accent-orange animate-[slideInLeft_1s_ease-out]"></div>
                <div className="h-1 w-24 bg-accent-orange"></div>
                <div className="h-0.5 w-16 bg-accent-orange animate-[slideInRight_1s_ease-out]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom text overlay with cargo elements */}
        <div className="absolute bottom-0 left-0 right-0 z-10 pb-20 pointer-events-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-block bg-gradient-to-r from-transparent via-black/30 to-transparent px-8 py-4 rounded-lg backdrop-blur-sm border-t border-b border-accent-orange/50">
                <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto font-semibold"
                   style={{
                     textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                     animation: 'fadeInUp 1.5s ease-out'
                   }}>
                  Select your destination on the map to get an instant quote for our international shipping services
                </p>
              </div>
              {/* Cargo container icons */}
              <div className="flex justify-center gap-8 mt-6">
                <div className="text-accent-orange opacity-70 animate-pulse" style={{ animationDelay: '0s' }}>
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z"/>
                  </svg>
                </div>
                <div className="text-accent-orange opacity-70 animate-pulse" style={{ animationDelay: '0.3s' }}>
                  <Plane className="w-8 h-8" />
                </div>
                <div className="text-accent-orange opacity-70 animate-pulse" style={{ animationDelay: '0.6s' }}>
                  <Ship className="w-8 h-8" />
                </div>
                <div className="text-accent-orange opacity-70 animate-pulse" style={{ animationDelay: '0.9s' }}>
                  <Truck className="w-8 h-8" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            width: 0;
          }
          to {
            opacity: 1;
            width: 4rem;
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            width: 0;
          }
          to {
            opacity: 1;
            width: 4rem;
          }
        }
      `}</style>

      {/* Decorative separator */}
      <div className="relative h-2 bg-gradient-to-r from-accent-orange via-primary-blue to-accent-orange">
        {/* Cargo Capital text - absolute positioned touching the line */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <h3 className="text-6xl md:text-8xl lg:text-9xl font-black whitespace-nowrap uppercase tracking-widest" 
              style={{ 
                color: '#F5F5F5',
                textShadow: '0 4px 20px rgba(0,0,0,0.7), 0 0 60px rgba(113,128,150,0.8), 2px 2px 4px rgba(0,0,0,0.9), -1px -1px 2px rgba(255,255,255,0.3)',
                fontFamily: '"Avenir Black", "Avenir", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                WebkitTextStroke: '1px rgba(113,128,150,0.3)'
              }}>
            CARGO CAPITAL
          </h3>
        </div>
      </div>

      {/* Main Content Section with Video Background */}
      <section className="relative py-32 overflow-hidden min-h-[90vh] flex items-center">
        {/* Video background */}
        <div className="absolute inset-0 z-0">
          <video
            key={activeVideo}
            className="absolute inset-0 h-full w-full object-cover"
            src={activeVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Main text and buttons */}
            <div className="space-y-8 text-white">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Nepal's #1 Best Cargo & <span style={{ color: '#718096' }}>Logistics Company</span>
              </h1>
              <p className="text-2xl text-gray-200 leading-relaxed">
                Top-rated international shipping and freight forwarding services in Kathmandu. 
                Trusted cargo delivery company offering air freight, sea freight, and reliable logistics solutions across Nepal and worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link 
                  to="/quote"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  style={{ backgroundColor: '#718096' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2D3748'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#718096'}
                >
                  Get Instant Quote
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link 
                  to="/tracking"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg border-2 border-white text-white hover:bg-white transition-all duration-300"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.color = '#4A5568';
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

            {/* Right side - Globe */}
            <div
              ref={heroGlobeRef}
              className="relative flex justify-center items-center"
            >
              {shouldLoadGlobe ? (
                <Suspense fallback={
                  <div className="flex h-[600px] w-full items-center justify-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-accent-orange" />
                  </div>
                }>
                  <Globe3D />
                </Suspense>
              ) : (
                <div className="flex h-[600px] w-full items-center justify-center rounded-3xl bg-smoke-dark/50 backdrop-blur-sm">
                  <span className="text-base font-medium text-white">Preparing interactive globe…</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 bg-primary-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#4A5568' }}>
                About Capital Cargo
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Established in 1998, Capital Cargo has been Nepal's most trusted logistics and freight forwarding company for over 27 years. We are headquartered in Kathmandu and specialize in international cargo shipping, connecting Nepali businesses with global markets.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                As Nepal's #1 cargo company, we handle everything from small parcels to large commercial shipments across 110+ countries worldwide. Our expertise spans air freight, sea freight, land transport, and door-to-door delivery services.
              </p>
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="bg-smoke-light p-6 rounded-xl border border-smoke-medium">
                  <div className="text-3xl font-bold mb-2" style={{ color: '#4A5568' }}>27+</div>
                  <div className="text-gray-700 font-medium">Years Experience</div>
                </div>
                <div className="bg-smoke-light p-6 rounded-xl border border-smoke-medium">
                  <div className="text-3xl font-bold mb-2" style={{ color: '#4A5568' }}>110+</div>
                  <div className="text-gray-700 font-medium">Countries Served</div>
                </div>
                <div className="bg-smoke-light p-6 rounded-xl border border-smoke-medium">
                  <div className="text-3xl font-bold mb-2" style={{ color: '#4A5568' }}>50K+</div>
                  <div className="text-gray-700 font-medium">Happy Customers</div>
                </div>
                <div className="bg-smoke-light p-6 rounded-xl border border-smoke-medium">
                  <div className="text-3xl font-bold mb-2" style={{ color: '#4A5568' }}>1M+</div>
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
              <div className="absolute -bottom-6 -left-6 bg-primary-white p-6 rounded-xl shadow-xl">
                <div className="flex items-center space-x-4">
                  <Award className="h-12 w-12" style={{ color: '#718096' }} />
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#4A5568' }}>
              Visit Our Office
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find us in the heart of Thamel, Kathmandu - Easy access for all your cargo needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Google Maps Embed */}
            <div className="bg-primary-white rounded-2xl shadow-2xl overflow-hidden">
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
            <div className="bg-primary-white rounded-2xl shadow-2xl p-8 flex flex-col justify-center">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: '#4A5568' }}>
                    Capital Cargo Nepal
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Located in the bustling heart of Thamel, our office provides easy access for all your international cargo and shipping needs.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="rounded-full p-3 mt-1" style={{ backgroundColor: '#718096' }}>
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
                    <div className="rounded-full p-3 mt-1" style={{ backgroundColor: '#718096' }}>
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
                    <div className="rounded-full p-3 mt-1" style={{ backgroundColor: '#718096' }}>
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
                    <div className="rounded-full p-3 mt-1" style={{ backgroundColor: '#718096' }}>
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
                    style={{ backgroundColor: '#718096' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2D3748'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#718096'}
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
      <section className="py-20 bg-primary-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#4A5568' }}>
              Why Choose Capital Cargo?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine 27 years of expertise with modern technology to deliver excellence
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-smoke-light to-smoke-medium rounded-xl p-8 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="rounded-full p-4 mb-4 w-fit" style={{ backgroundColor: '#718096' }}>
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#4A5568' }}>Expert Knowledge</h3>
              <p className="text-gray-700">27+ years of experience in international logistics and deep understanding of Nepali markets and customs procedures.</p>
            </div>
            <div className="bg-gradient-to-br from-smoke-light to-smoke-medium rounded-xl p-8 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="rounded-full p-4 mb-4 w-fit" style={{ backgroundColor: '#718096' }}>
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#4A5568' }}>Secure & Reliable</h3>
              <p className="text-gray-700">Advanced tracking systems, comprehensive insurance options, and secure packaging to ensure your cargo reaches safely.</p>
            </div>
            <div className="bg-gradient-to-br from-smoke-light to-smoke-medium rounded-xl p-8 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="rounded-full p-4 mb-4 w-fit" style={{ backgroundColor: '#718096' }}>
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#4A5568' }}>On-Time Delivery</h3>
              <p className="text-gray-700">Committed to meeting delivery schedules with 99.9% on-time performance rate across all shipping methods.</p>
            </div>
            <div className="bg-gradient-to-br from-smoke-light to-smoke-medium rounded-xl p-8 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="rounded-full p-4 mb-4 w-fit" style={{ backgroundColor: '#718096' }}>
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#4A5568' }}>Global Network</h3>
              <p className="text-gray-700">Extensive network covering 110+ countries with trusted airline and shipping partners worldwide.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-smoke-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#4A5568' }}>
              Our Services
            </h2>
            <p className="text-xl text-primary-blue max-w-3xl mx-auto">
              Comprehensive logistics solutions tailored for Nepali businesses and international trade
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-primary-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 rounded-full p-3 w-fit" style={{ backgroundColor: '#718096', color: 'white' }}>
                    <service.icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3" style={{ color: '#4A5568' }}>{service.title}</h3>
                  <p className="text-primary-blue mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-primary-blue">
                        <CheckCircle className="h-4 w-4 mr-2" style={{ color: '#718096' }} />
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
      <section className="py-20 bg-primary-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#4A5568' }}>
              What Our Clients Say
            </h2>
            <p className="text-xl text-primary-blue">
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
                <div key={index} className="bg-smoke-light rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 min-w-[350px] max-w-[350px] flex-shrink-0 mx-2">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, starIndex) => (
                      <Star key={starIndex} className="h-5 w-5 fill-current" style={{ color: '#718096' }} />
                    ))}
                  </div>
                  <p className="text-primary-blue mb-6 italic">"{testimonial.text}"</p>
                  <div>
                    <div className="font-semibold" style={{ color: '#4A5568' }}>{testimonial.name}</div>
                    <div className="text-sm text-smoke-medium">{testimonial.company}</div>
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
      <section className="py-20 text-white" style={{ background: 'linear-gradient(135deg, #4A5568 0%, #2D3748 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Ship Your Cargo?
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Get started with a free quote and discover how we can help your business reach global markets.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/quote"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: '#718096' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2D3748'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#718096'}
            >
              Get Free Quote
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg border-2 border-white text-white hover:bg-primary-white transition-all duration-300"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = '#4A5568';
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