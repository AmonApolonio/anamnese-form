import React from 'react';

interface RandomUrlButtonProps {
  onGetRandomUrl: () => void;
  className?: string;
  buttonText?: string;
}

/**
 * A button component that triggers a random URL selection
 */
const RandomUrlButton: React.FC<RandomUrlButtonProps> = ({ 
  onGetRandomUrl, 
  className = "px-8 py-3 rounded-xl bg-[#947B62] text-white font-semibold shadow hover:bg-[#7a624e] focus:ring-4 focus:ring-[#947B62]/30 transition-all", 
  buttonText = "Obter URL Aleatória" 
}) => {
  return (
    <button
      type="button"
      className={className}
      onClick={onGetRandomUrl}
    >
      {buttonText}
    </button>
  );
};

export default RandomUrlButton;
