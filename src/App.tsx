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

    const finalizeSplash = () => {
      if (isMounted && minimumDurationComplete && homeModuleLoaded) {
        setIsSplashVisible(false);
      }
    };

    const timeoutId = window.setTimeout(() => {
      minimumDurationComplete = true;
      finalizeSplash();
    }, 1200);

    import('./pages/Home')
      .then(() => {
        homeModuleLoaded = true;
        finalizeSplash();
      })
      .catch(() => {
        // If preload fails, allow the splash to dismiss after the minimum duration.
        homeModuleLoaded = true;
        finalizeSplash();
      });

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (isSplashVisible || hasPrefetched.current) {
      return;
    }

    const preloadRoutes = () => {
      Promise.all([
        import('./pages/About'),
        import('./pages/Services'),
        import('./pages/Tracking'),
        import('./pages/Quote'),
        import('./pages/FAQ'),
        import('./pages/Blog'),
        import('./pages/BlogPost'),
        import('./pages/Contact'),
        import('./pages/AdminTracking'),
        import('./pages/AdminApp'),
        import('./pages/UnifiedAdminPanel'),
        import('./pages/DataTools'),
        import('./pages/AdminTest'),
        import('./pages/TestAPI'),
      ]).catch(() => {
        // Ignore preload errors; navigation will fallback to lazy loading.
      });
      hasPrefetched.current = true;
    };

    const extendedWindow = window as typeof window & {
      requestIdleCallback?: (cb: () => void) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (typeof extendedWindow.requestIdleCallback === 'function') {
      hasPrefetched.current = true;
      const idleHandle = extendedWindow.requestIdleCallback(preloadRoutes);
      return () => {
        extendedWindow.cancelIdleCallback?.(idleHandle);
      };
    }

    hasPrefetched.current = true;
    const timeoutId = window.setTimeout(preloadRoutes, 300);
    return () => window.clearTimeout(timeoutId);
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
