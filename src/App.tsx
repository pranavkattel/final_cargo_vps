import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import type { TransitionEvent } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NepaliCalendar from './components/NepaliCalendar';
import ScrollToTop from './components/ScrollToTop';
import LoadingSplash from './components/LoadingSplash';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Tracking = lazy(() => import('./pages/Tracking'));
const Quote = lazy(() => import('./pages/Quote'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Contact = lazy(() => import('./pages/Contact'));
const AdminTracking = lazy(() => import('./pages/AdminTracking'));
const AdminTest = lazy(() => import('./pages/AdminTest'));
const TestAPI = lazy(() => import('./pages/TestAPI'));
const AdminApp = lazy(() => import('./pages/AdminApp'));
const UnifiedAdminPanel = lazy(() => import('./pages/UnifiedAdminPanel'));
const DataTools = lazy(() => import('./pages/DataTools'));

function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const hasPrefetched = useRef(false);

  useEffect(() => {
    let isMounted = true;
    let minimumDurationComplete = false;
    let homeModuleLoaded = false;
    let allResourcesLoaded = false;

    const finalizeSplash = () => {
      if (isMounted && minimumDurationComplete && homeModuleLoaded && allResourcesLoaded) {
        setIsSplashVisible(false);
        
        // Remove the initial HTML loader
        setTimeout(() => {
          const initialLoader = document.getElementById('initial-loader');
          if (initialLoader) {
            document.body.classList.add('app-loaded');
            setTimeout(() => {
              initialLoader.remove();
            }, 500);
          }
        }, 100);
      }
    };

    // Maximum timeout to force load completion (fallback safety)
    const maxTimeoutId = window.setTimeout(() => {
      console.log('Force completing loading after maximum timeout');
      allResourcesLoaded = true;
      finalizeSplash();
    }, 4000); // Maximum 4 seconds total (reduced from 8s)

    // Wait for all images and videos to load
    const waitForAllResources = () => {
      // Use window.load as primary method
      if (document.readyState === 'complete') {
        allResourcesLoaded = true;
        finalizeSplash();
        return;
      }

      const onWindowLoad = () => {
        console.log('Window load event fired');
        allResourcesLoaded = true;
        finalizeSplash();
      };

      window.addEventListener('load', onWindowLoad, { once: true });

      // Secondary check: monitor resources
      let checkCount = 0;
      const maxChecks = 15; // 1.5 seconds max for this check (reduced from 3s)
      
      const intervalId = setInterval(() => {
        checkCount++;
        
        const images = Array.from(document.images);
        const videos = Array.from(document.querySelectorAll('video'));
        
        let allLoaded = true;
        
        // Check images
        images.forEach(img => {
          if (!img.complete && !img.src.includes('favicon')) {
            allLoaded = false;
          }
        });
        
        // Check videos
        videos.forEach(video => {
          if (video.readyState < 3) {
            allLoaded = false;
          }
        });

        // If all loaded or max checks reached
        if (allLoaded || checkCount >= maxChecks) {
          console.log('Resources check complete:', { allLoaded, checkCount });
          clearInterval(intervalId);
          window.removeEventListener('load', onWindowLoad);
          allResourcesLoaded = true;
          finalizeSplash();
        }
      }, 100);

      return () => {
        clearInterval(intervalId);
        window.removeEventListener('load', onWindowLoad);
      };
    };

    const timeoutId = window.setTimeout(() => {
      minimumDurationComplete = true;
      finalizeSplash();
    }, 500); // Minimum 500ms for smooth loading experience

    import('./pages/Home')
      .then(() => {
        homeModuleLoaded = true;
        // Start checking for resources after Home module is loaded
        setTimeout(waitForAllResources, 100);
        finalizeSplash();
      })
      .catch(() => {
        console.error('Failed to load Home module');
        // If preload fails, allow the splash to dismiss after the minimum duration.
        homeModuleLoaded = true;
        allResourcesLoaded = true;
        finalizeSplash();
      });

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
      window.clearTimeout(maxTimeoutId);
    };
  }, []);

  useEffect(() => {
    // Preload Globe3D immediately during loading screen (critical for home page)
    if (!hasPrefetched.current) {
      console.log('Preloading Globe3D for home page...');
      import('./components/Globe3D')
        .then(() => console.log('Globe3D preloaded successfully'))
        .catch((err) => console.error('Error preloading Globe3D:', err));
      hasPrefetched.current = true;
    }
  }, []);

  useEffect(() => {
    // After splash screen is gone, preload other pages in background
    if (isSplashVisible) {
      return;
    }

    console.log('Home page loaded! Preloading other pages in background...');
    
    // Small delay to ensure home page is fully rendered first
    const timeoutId = setTimeout(() => {
      Promise.all([
        import('./pages/About'),
        import('./pages/Services'),
        import('./pages/Tracking'),
        import('./pages/Quote'),
        import('./pages/FAQ'),
        import('./pages/Blog'),
        import('./pages/BlogPost'),
        import('./pages/Contact'),
        // Admin pages load on-demand only
      ])
        .then(() => console.log('All other pages preloaded successfully in background'))
        .catch((err) => console.error('Error preloading pages:', err));
    }, 500); // Wait 500ms after home loads

    return () => clearTimeout(timeoutId);
  }, [isSplashVisible]);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          {isSplashVisible && <LoadingSplash />}
          <Suspense
            fallback={
              isSplashVisible ? null : (
                <div className="py-20 text-center text-gray-600">Loading…</div>
              )
            }
          >
            <AnimatedRoutes />
          </Suspense>
        </main>
        <Footer />
        <NepaliCalendar />
      </div>
    </Router>
  );
}

export default App;

const AnimatedRoutes = () => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState<'fadeIn' | 'fadeOut'>('fadeIn');

  useEffect(() => {
    const isSameLocation =
      location.pathname === displayLocation.pathname &&
      location.search === displayLocation.search &&
      location.hash === displayLocation.hash;

    if (!isSameLocation) {
      setTransitionStage('fadeOut');
    }
  }, [location, displayLocation]);

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.propertyName !== 'opacity') {
      return;
    }

    if (transitionStage === 'fadeOut') {
      setDisplayLocation(location);
      setTransitionStage('fadeIn');
    }
  };

  return (
    <div
      className={`page-transition ${transitionStage}`}
      onTransitionEnd={handleTransitionEnd}
    >
      <Routes location={displayLocation}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/tracking" element={<Tracking />} />
        <Route path="/quote" element={<Quote />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<AdminTracking />} />
        <Route path="/admin-panel" element={<AdminApp />} />
        <Route path="/admin-unified" element={<UnifiedAdminPanel />} />
        <Route path="/admin-tools" element={<DataTools />} />
        <Route path="/admin-test" element={<AdminTest />} />
        <Route path="/test-api" element={<TestAPI />} />
      </Routes>
    </div>
  );
};
