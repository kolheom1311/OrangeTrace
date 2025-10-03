'use client';

export default function IOSLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
      <div className="relative w-12 h-12">
        {[...Array(12)].map((_, i) => (
          <span
            key={i}
            className="absolute top-0 left-1/2 w-2 h-7 bg-white rounded-full"
            style={{
              transform: `rotate(${i * 30}deg) translate(-50%, -110%)`,
              opacity: 1 - i * 0.07,
              animation: 'iosspin 1.2s linear infinite',
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
        <style jsx>{`
          @keyframes iosspin {
            0% {
              opacity: 1;
            }
            100% {
              opacity: 0.2;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
