import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Plane, Ship, Truck, Shield, Clock, Globe, CheckCircle, Star, Award, DoorOpen } from 'lucide-react';
import earthTexture from '../assets/images/earth_texture.jpg';

// Lazy load Globe3D for better initial page load
const Globe3D = lazy(() => import('../components/Globe3D'));

const Home = () => {
  const heroGlobeRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoadGlobe, setShouldLoadGlobe] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [isAnimationPaused, setIsAnimationPaused] = useState(false);
  // Use public folder paths for large video files
  const videoSources = useMemo(() => ['/videos/vid1.mp4', '/videos/vid2.mp4'], []);
  const [activeVideo, setActiveVideo] = useState(() => videoSources[0]);

  const regionCountries: Record<string, string[]> = {
    'North America': ['United States', 'Canada', 'Mexico'],
    'South America': ['Brazil', 'Argentina', 'Chile', 'Colombia', 'Peru'],
    'Asia': ['China', 'Japan', 'South Korea', 'India', 'Singapore', 'Thailand', 'Malaysia'],
    'Oceania': ['Australia', 'New Zealand'],
    'East Asia': ['Japan', 'South Korea', 'Taiwan', 'Hong Kong'],
    'Africa': ['South Africa', 'Egypt', 'Kenya', 'Nigeria'],
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



  // Hide instructions after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInstructions(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Resume animation when no region is selected
  useEffect(() => {
    if (selectedRegion === null) {
      setIsAnimationPaused(false);
    } else {
      setIsAnimationPaused(true);
    }
  }, [selectedRegion]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectedRegion) {
        const target = event.target as HTMLElement;
        // Check if click is outside dropdown
        if (!target.closest('.country-dropdown') && !target.closest('.point-marker')) {
          setSelectedRegion(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedRegion]);

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
    <div style={{ fontSize: '90%' }}>
      {/* SEO Content - Hidden but crawlable */}
      <div className="sr-only">
        <h1>Capital Cargo - #1 Best Cargo Company in Nepal</h1>
        <p>Capital Cargo is Nepal's leading cargo company and top-rated logistics service provider based in Kathmandu. As the #1 freight forwarding company in Nepal, we offer best international shipping, air freight services, sea freight, and reliable cargo delivery across Nepal and worldwide. Trusted by thousands for import-export cargo solutions.</p>
        <p>Services: Best air freight company Nepal, top cargo shipping, international shipping Nepal, freight forwarding services, logistics and cargo transport, import export services, door-to-door delivery Kathmandu</p>
      </div>
      
      {/* Hero Section - Earth Texture with Clickable Points */}
      <section className="relative text-white min-h-[70vh] flex items-center overflow-hidden">
        {/* Earth texture background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 md:animate-slow-zoom">
            <div 
              className="absolute inset-0 md:w-full md:h-full w-[250%] h-full md:left-0 left-0 animate-map-slide-mobile"
              style={{ animationPlayState: isAnimationPaused ? 'paused' : 'running' }}
            >
              <img
                src={earthTexture}
                alt="Earth"
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50 pointer-events-none"></div>
          
          {/* Animated grid overlay for cargo tech feel */}
          <div className="absolute inset-0 opacity-10" 
               style={{
                 backgroundImage: 'linear-gradient(rgba(113,128,150,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(113,128,150,0.5) 1px, transparent 1px)',
                 backgroundSize: '50px 50px'
               }}>
          </div>
          
          {/* Animated corner accents */}
          <div className="absolute top-0 left-0 w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 border-t-4 border-l-4 border-accent-orange animate-pulse"></div>
          <div className="absolute top-0 right-0 w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 border-t-4 border-r-4 border-accent-orange animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 border-b-4 border-l-4 border-accent-orange animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 border-b-4 border-r-4 border-accent-orange animate-pulse"></div>

          <div 
            className="absolute inset-0 md:w-full md:h-full w-[250%] h-full animate-map-slide-mobile md:animate-slow-zoom pointer-events-none"
            style={{ animationPlayState: isAnimationPaused ? 'paused' : 'running' }}
          >
            {/* Animated connection lines between icons */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" style={{ zIndex: 5 }}>
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0 }} />
                  <stop offset="50%" style={{ stopColor: '#ffffff', stopOpacity: 0.8 }} />
                  <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 0 }} />
                </linearGradient>
              </defs>
            {/* All lines converging to Asia point (75%, 35%) */}
            {/* From North America point */}
            <line x1="21%" y1="30%" x2="75%" y2="35%" stroke="url(#lineGradient)" strokeWidth="1.5" className="animate-dash">
              <animate attributeName="stroke-dashoffset" from="1000" to="0" dur="4s" repeatCount="indefinite" begin="0.3s" />
            </line>
            {/* From Europe point */}
            <line x1="57%" y1="24%" x2="75%" y2="35%" stroke="url(#lineGradient)" strokeWidth="1.5" className="animate-dash">
              <animate attributeName="stroke-dashoffset" from="1000" to="0" dur="4s" repeatCount="indefinite" begin="0.8s" />
            </line>
            {/* From South America point */}
            <line x1="30%" y1="52%" x2="75%" y2="35%" stroke="url(#lineGradient)" strokeWidth="1.5" className="animate-dash">
              <animate attributeName="stroke-dashoffset" from="1000" to="0" dur="4s" repeatCount="indefinite" begin="1.3s" />
            </line>
            {/* From Middle East point */}
            <line x1="63%" y1="36%" x2="75%" y2="35%" stroke="url(#lineGradient)" strokeWidth="1.5" className="animate-dash">
              <animate attributeName="stroke-dashoffset" from="1000" to="0" dur="4s" repeatCount="indefinite" begin="1.8s" />
            </line>
            {/* From East Asia point */}
            <line x1="89%" y1="32%" x2="75%" y2="35%" stroke="url(#lineGradient)" strokeWidth="1.5" className="animate-dash">
              <animate attributeName="stroke-dashoffset" from="1000" to="0" dur="4s" repeatCount="indefinite" begin="2.3s" />
            </line>
            {/* From Africa point */}
            <line x1="50%" y1="40%" x2="75%" y2="35%" stroke="url(#lineGradient)" strokeWidth="1.5" className="animate-dash">
              <animate attributeName="stroke-dashoffset" from="1000" to="0" dur="4s" repeatCount="indefinite" begin="2.8s" />
            </line>
            {/* From Oceania point */}
            <line x1="88%" y1="68%" x2="75%" y2="35%" stroke="url(#lineGradient)" strokeWidth="1.5" className="animate-dash">
              <animate attributeName="stroke-dashoffset" from="1000" to="0" dur="4s" repeatCount="indefinite" begin="3.3s" />
            </line>
            </svg>

            {/* Clickable animated location points overlay */}
            <div className="absolute inset-0 w-full h-full pointer-events-auto md:scale-100 scale-105" style={{ transformOrigin: 'top left' }}>
              {[
              { top: '27%', left: '20%', delay: '0s', label: 'North America' },
              { top: '52%', left: '30%', delay: '0.5s', label: 'South America' },
              { top: '35%', left: '75%', delay: '1s', label: 'Asia' },
              { top: '68%', left: '88%', delay: '1.5s', label: 'Oceania' },
              { top: '32%', left: '89%', delay: '2s', label: 'East Asia' },
              { top: '40%', left: '50%', delay: '2.5s', label: 'Africa' },
              { top: '24%', left: '57%', delay: '3s', label: 'Europe' },
              { top: '36%', left: '63%', delay: '3.5s', label: 'Middle East' },
            ].map((point, index) => (
              <div
                key={index}
                className={`absolute group cursor-pointer transition-all duration-300 z-10 point-marker ${selectedRegion === point.label ? '' : 'animate-pulse hover:animate-none'}`}
                style={{
                  top: point.top,
                  left: point.left,
                  animationDelay: point.delay,
                }}
                onClick={() => {
                  if (selectedRegion === point.label) {
                    // Closing the dropdown
                    setSelectedRegion(null);
                    setIsAnimationPaused(false);
                  } else {
                    // Opening a dropdown
                    setSelectedRegion(point.label);
                    setIsAnimationPaused(true);
                  }
                }}
              >
                <div className="relative">
                  {/* Main Point - Responsive and more visible - Hidden when ANY dropdown is open */}
                  {!selectedRegion && (
                    <>
                      <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 bg-accent-orange rounded-full opacity-95 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300 shadow-2xl border-2 sm:border-3 border-white"></div>
                      
                      {/* Pulsing Ring - Responsive */}
                      <div className="absolute inset-0 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 bg-accent-orange rounded-full animate-ping opacity-50 group-hover:opacity-70"></div>
                      
                      {/* Outer Glow - Responsive */}
                      <div className="absolute inset-0 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 bg-accent-orange rounded-full blur-md opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
                      
                      {/* Extra outer ring for visibility - Responsive */}
                      <div className="absolute -inset-1 w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 border-2 border-white/50 rounded-full"></div>
                      
                      {/* Hover Tooltip - Responsive */}
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 translate-y-full px-2 py-1 sm:px-3 sm:py-1.5 bg-white text-smoke-dark text-[10px] sm:text-xs font-semibold rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-lg border border-accent-orange">
                        {point.label}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-[3px] sm:border-4 border-transparent border-b-white"></div>
                      </div>
                    </>
                  )}

                  {/* Country Dropdown - Responsive */}
                  {selectedRegion === point.label && (
                    <div 
                      className="country-dropdown absolute top-full right-0 mt-2 sm:mt-4 bg-white rounded-lg sm:rounded-xl shadow-2xl p-3 sm:p-4 min-w-[200px] sm:min-w-[240px] max-h-[280px] sm:max-h-[320px] overflow-hidden border border-gray-100 z-[9999]"
                      style={{
                        backdropFilter: 'blur(10px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.98)',
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-between items-center mb-2 sm:mb-3 pb-2 sm:pb-3 border-b-2 border-gradient-to-r from-accent-orange to-transparent">
                        <h4 className="font-bold text-smoke-dark text-sm sm:text-base flex items-center gap-1 sm:gap-2">
                          <span className="text-accent-orange text-sm sm:text-base">📍</span>
                          {point.label}
                        </h4>
                        <button 
                          onClick={() => setSelectedRegion(null)}
                          className="text-gray-400 hover:text-accent-orange text-xl sm:text-2xl leading-none transition-colors duration-200 w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full hover:bg-gray-100"
                        >
                          ×
                        </button>
                      </div>
                      <div className="space-y-1 max-h-[200px] sm:max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
                        {regionCountries[point.label]?.map((country, idx) => (
                          <Link
                            key={idx}
                            to={`/quote?destination=${encodeURIComponent(country)}`}
                            className="block px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg text-xs sm:text-sm transition-all duration-200 hover:bg-gradient-to-r hover:from-accent-orange hover:to-orange-500 hover:text-white text-smoke-dark font-medium hover:shadow-md hover:scale-[1.02] transform group"
                          >
                            <span className="flex items-center gap-2">
                              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">✈️</span>
                              {country}
                            </span>
                          </Link>
                        ))}
                      </div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-b-6 sm:border-l-8 sm:border-r-8 sm:border-b-8 border-transparent border-b-white" style={{ filter: 'drop-shadow(0 -2px 2px rgba(0,0,0,0.05))' }}></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>

        {/* Instruction Text - Visible for 5 seconds */}
        {showInstructions && (
          <div className="absolute bottom-0 left-0 right-0 z-20 pb-12 pointer-events-none">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <div 
                  className="inline-block bg-white/90 px-6 py-3 rounded-xl backdrop-blur-md border border-gray-300/50 shadow-lg"
                  style={{
                    animation: 'fadeInBounce 0.6s ease-out'
                  }}
                >
                  <p className="text-base md:text-lg font-semibold flex items-center gap-2"
                     style={{
                       color: '#4A5568',
                       textShadow: '0 1px 2px rgba(255,255,255,0.5)',
                     }}>
                    <span className="text-xl animate-pulse">👆</span>
                    Click the glowing points to select your destination
                    <span className="text-xl animate-pulse">👆</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Globe in top left corner - responsive */}
        <div className="absolute top-2 left-2 z-20 pointer-events-auto">
          <div
            ref={heroGlobeRef}
            className="relative w-[80px] h-[80px] sm:w-[112px] sm:h-[112px] md:w-[144px] md:h-[144px] lg:w-[182px] lg:h-[182px] xl:w-[227px] xl:h-[227px]"
          >
            {shouldLoadGlobe ? (
              <Suspense fallback={
                <div className="flex h-full w-full items-center justify-center">
                  <div className="h-3 w-3 sm:h-5 sm:w-5 md:h-6 md:w-6 animate-spin rounded-full border-b-2 border-accent-orange" />
                </div>
              }>
                <Globe3D />
              </Suspense>
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-2xl bg-smoke-dark/30 backdrop-blur-sm">
                <span className="text-xs font-medium text-white">Loading...</span>
              </div>
            )}
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
        @keyframes fadeInBounce {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
          50% {
            transform: translateY(-5px) scale(1.02);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
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
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-15px) rotate(2deg);
          }
          50% {
            transform: translateY(-25px) rotate(0deg);
          }
          75% {
            transform: translateY(-15px) rotate(-2deg);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes dash {
          to {
            stroke-dashoffset: 0;
          }
        }
        .animate-dash {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
        }
      `}</style>

      {/* Decorative separator */}
      <div className="relative h-2 bg-gradient-to-r from-accent-orange via-primary-blue to-accent-orange">
        {/* Cargo Capital text - absolute positioned touching the line - responsive */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 px-4">
          <h3 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl xl:text-9xl font-black whitespace-nowrap uppercase tracking-wider sm:tracking-wide md:tracking-widest" 
              style={{
                color: '#CBD5E0',
                textShadow: '0 6px 18px rgba(0,0,0,0.8), 0 0 60px rgba(113,128,150,0.6)',
                fontFamily: '"Times New Roman", Times, serif',
                fontWeight: 'bold',
                letterSpacing: '0.05em',
                WebkitTextStroke: '1.5px #000000',
                paintOrder: 'stroke fill',
                filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.9))'
              }}>
            CAPITAL CARGO 
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
          <div className="flex items-center justify-center">
            {/* Centered content - Main text and buttons */}
            <div className="space-y-8 text-white text-center max-w-4xl">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Nepal's #1 Best Cargo & <span style={{ color: '#718096' }}>Logistics Company</span>
              </h1>
              <p className="text-2xl text-gray-200 leading-relaxed">
                Top-rated international shipping and freight forwarding services in Kathmandu. 
                Trusted cargo delivery company offering air freight, sea freight, and reliable logistics solutions across Nepal and worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
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