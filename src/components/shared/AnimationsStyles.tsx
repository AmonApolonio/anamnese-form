import React from 'react';

/**
 * A component that provides common CSS animations for the application
 */
const AnimationsStyles: React.FC = () => {
  return (
    <style>{`
      .animate-fadein { animation: fadein 0.7s; }
      @keyframes fadein { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
      
      .animate-spin-smooth {
        animation: spin-smooth 1s linear infinite;
        display: inline-block;
        vertical-align: middle;
      }
      @keyframes spin-smooth {
        100% { transform: rotate(360deg); }
      }
      
      .animate-spin-reverse {
        animation: spin-reverse 1.5s linear infinite;
        display: inline-block;
        vertical-align: middle;
      }
      @keyframes spin-reverse {
        100% { transform: rotate(-360deg); }
      }
      
      .animate-pulse-text {
        animation: pulse-text 1.2s infinite;
      }
      @keyframes pulse-text {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      
      /* Moving gradient animation */
      .animate-gradient-move {
        background: linear-gradient(120deg, #fff, #6C4A3D, #947B62, #fff, #C5A87E, #947B62, #6C4A3D, #fff);
        background-size: 600% 600%;
        animation: gradientMove 5s ease-in-out infinite;
        width: 100%;
        height: 100%;
      }
      @keyframes gradientMove {
        0% { background-position: 10% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 10% 50%; }
      }
    `}</style>
  );
};

export default AnimationsStyles;
