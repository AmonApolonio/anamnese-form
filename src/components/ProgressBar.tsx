import React from 'react';

interface ProgressBarProps {
  currentStep: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  const totalSteps = 16;
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="max-w-xl mx-auto mb-8">
      <div className="flex justify-between mb-1 text-sm text-gray-600">
        <span>Questão {currentStep} de {totalSteps}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className="bg-[#947B62] h-3 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
