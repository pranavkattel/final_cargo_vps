import { useEffect, useState } from 'react';

type LoadingSplashProps = {
  onFinish?: () => void;
};

const LoadingSplash = ({ onFinish }: LoadingSplashProps) => {
  const [progress, setProgress] = useState(90);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Animate from 90% to 100% smoothly
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = originalOverflow;
      onFinish?.();
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-gradient-to-br from-[#001f3f] via-[#003b70] to-[#0077b6] px-6 text-center text-white opacity-0 animate-[fadeIn_0.3s_ease-in_forwards]">
      <div className="relative mb-10 h-56 w-56 sm:h-64 sm:w-64 md:h-80 md:w-80">
        <div className="absolute inset-0 rounded-full bg-primary-blue/15 blur-3xl animate-pulse" />
        <div className="absolute inset-0 rounded-full border-4 border-white/15" />
        <div
          className="absolute inset-4 rounded-full border-4 border-white/20 animate-spin"
          style={{ animationDuration: '18s', borderTopColor: '#718096', borderLeftColor: 'transparent', borderBottomColor: '#718096', borderRightColor: 'transparent' }}
        />
        <div
          className="absolute inset-8 rounded-full border-4 border-white/30 animate-spin"
          style={{ animationDuration: '26s', animationDirection: 'reverse', borderRightColor: '#718096', borderTopColor: 'transparent', borderLeftColor: '#718096', borderBottomColor: 'transparent' }}
        />
        <div className="absolute inset-14 rounded-full bg-gradient-to-br from-smoke-medium/40 via-white/30 to-blue-400/40" />
        <div className="absolute inset-[5.25rem] h-6 w-6 rounded-full bg-[#718096] shadow-lg shadow-orange-400/40 sm:inset-[6.5rem] md:inset-[8rem]" />
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '32s' }}>
          <div className="absolute left-1/2 top-1/2 h-[90%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/10" />
        </div>
      </div>

      <h1 className="mb-4 text-3xl font-bold tracking-wide sm:text-4xl md:text-5xl">
        Almost Ready...
      </h1>
      <p className="max-w-2xl text-lg text-gray-200 sm:text-xl mb-8">
        Finalizing your experience
      </p>
      
      {/* Progress indicator */}
      <div className="w-full max-w-md">
        <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-3">
          <div 
            className="h-full bg-gradient-to-r from-[#718096] to-[#4A5568] transition-all duration-300 ease-out rounded-full shadow-lg shadow-[#718096]/50"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-sm font-semibold tracking-wider">{progress}%</div>
      </div>
    </div>
  );
};

export default LoadingSplash;
