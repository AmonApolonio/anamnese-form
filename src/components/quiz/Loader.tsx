import React from 'react';

interface LoaderProps {
  statusText?: string | null;
}

/**
 * A reusable loader component with animation
 */
const Loader: React.FC<LoaderProps> = ({ statusText }) => {
  return (
    <span className="flex flex-col items-center justify-center gap-2">
      <span className="relative w-10 h-10 inline-block">
        <svg className="absolute top-0 left-0 animate-spin-smooth" width="40" height="40" viewBox="0 0 50 50">
          <defs>
            <linearGradient id="loader-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#947B62" />
              <stop offset="100%" stopColor="#e5dbce" />
            </linearGradient>
          </defs>
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="url(#loader-gradient)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="90 150"
            opacity="0.8"
          />
        </svg>
        <svg className="absolute top-0 left-0 animate-spin-reverse" width="40" height="40" viewBox="0 0 50 50">
          <circle
            cx="25"
            cy="25"
            r="15"
            fill="none"
            stroke="#e5dbce"
            strokeWidth="3"
            strokeDasharray="40 60"
            opacity="0.7"
          />
        </svg>
      </span>
      <span className="ml-2 animate-pulse-text">{statusText || 'Processando...'}</span>
    </span>
  );
};

export default Loader;
