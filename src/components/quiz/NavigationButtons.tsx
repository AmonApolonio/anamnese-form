import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faCheck } from '@fortawesome/free-solid-svg-icons';

interface NavigationButtonsProps {
  onNext: () => void;
  onPrev: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  isCurrentQuestionAnswered: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({ 
  onNext, 
  onPrev, 
  isFirstQuestion, 
  isLastQuestion,
  isCurrentQuestionAnswered
}) => {
  return (
    <div className="flex justify-between mt-8 max-w-xl mx-auto">
      {!isFirstQuestion ? (
        <button
          onClick={onPrev}
          className="flex items-center px-6 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Anterior
        </button>
      ) : (
        <div></div>
      )}

      <button
        onClick={onNext}
        disabled={!isCurrentQuestionAnswered}
        className={`flex items-center px-6 py-2 rounded-lg transition-colors font-semibold ${isCurrentQuestionAnswered ? 'bg-[#947B62] text-white hover:bg-[#7a624e]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
      >
        {isLastQuestion ? (
          <FontAwesomeIcon icon={faCheck} className="mr-2" />
        ) : (
          <FontAwesomeIcon icon={faArrowRight} className="mr-2" />
        )}
        {isLastQuestion ? 'Finalizar' : 'Próxima'}
      </button>
    </div>
  );
};

export default NavigationButtons;
