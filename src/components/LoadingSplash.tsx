import { useEffect } from 'react';

type LoadingSplashProps = {
  onFinish?: () => void;
};

const LoadingSplash = ({ onFinish }: LoadingSplashProps) => {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
      onFinish?.();
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-[#001f3f] via-[#003b70] to-[#0077b6] px-6 text-center text-white">
      <div className="relative mb-10 h-56 w-56 sm:h-64 sm:w-64 md:h-80 md:w-80">
        <div className="absolute inset-0 rounded-full bg-blue-200/15 blur-3xl" />
        <div className="absolute inset-0 rounded-full border-4 border-white/15" />
        <div
          className="absolute inset-4 rounded-full border-4 border-white/20 animate-spin"
          style={{ animationDuration: '18s', borderTopColor: '#f9b222', borderLeftColor: 'transparent', borderBottomColor: '#f9b222', borderRightColor: 'transparent' }}
        />
        <div
          className="absolute inset-8 rounded-full border-4 border-white/30 animate-spin"
          style={{ animationDuration: '26s', animationDirection: 'reverse', borderRightColor: '#f9b222', borderTopColor: 'transparent', borderLeftColor: '#f9b222', borderBottomColor: 'transparent' }}
        />
        <div className="absolute inset-14 rounded-full bg-gradient-to-br from-blue-100/40 via-white/30 to-blue-400/40" />
        <div className="absolute inset-[5.25rem] h-6 w-6 rounded-full bg-[#f9b222] shadow-lg shadow-orange-400/40 sm:inset-[6.5rem] md:inset-[8rem]" />
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '32s' }}>
          <div className="absolute left-1/2 top-1/2 h-[90%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/10" />
        </div>
      </div>

      <h1 className="mb-4 text-3xl font-bold tracking-wide sm:text-4xl md:text-5xl">
        Welcome to Nepal's Best Cargo Service
      </h1>
      <p className="max-w-2xl text-lg text-blue-100 sm:text-xl">
        Loading your global logistics experience... please hold tight while we prepare the fastest routes around the world.
      </p>
    </div>
  );
};

export default LoadingSplash;
