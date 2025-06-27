import React from 'react';
import { Question, Option, UserAnswer } from '../types';

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: UserAnswer) => void;
  currentAnswer?: string;
}

const isPhotoGrid = (options: Option[]) =>
  options.every(option => !!option.image);

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer, currentAnswer }) => {
  if (isPhotoGrid(question.options)) {
    return (
      <div className="bg-white rounded-lg shadow p-8 max-w-xl mx-auto mb-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">{question.text}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {question.options.map((option: Option) => (
            <div
              key={option.id}
              onClick={() => onAnswer({ questionId: question.id, optionId: option.id })}
              className={`cursor-pointer rounded-lg border-2 p-2 flex flex-col items-center transition-colors duration-150 ${currentAnswer === option.id ? 'border-[#947B62] bg-[#F5F0EA]' : 'border-gray-200 hover:border-[#947B62]'}`}
            >
              <img
                src={option.image}
                alt={`Opção ${option.id}`}
                className={`w-24 h-24 object-contain mb-2}`}
              />
              <span className="font-semibold text-gray-700">{option.id}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-8 max-w-xl mx-auto mb-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">{question.text}</h2>
      <div className="space-y-4">
        {question.options.map((option: Option) => (
          <div 
            key={option.id}
            onClick={() => onAnswer({ questionId: question.id, optionId: option.id })}
            className={`flex items-center cursor-pointer px-4 py-3 rounded-lg border transition-colors duration-150 ${currentAnswer === option.id ? 'bg-[#F5F0EA] border-[#947B62]' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
          >
            <div className={`w-5 h-5 aspect-square flex-shrink-0 rounded-full border flex items-center justify-center mr-3 ${currentAnswer === option.id ? 'border-[#947B62]' : 'border-gray-400'}`}>
              {currentAnswer === option.id && (
                <div className="w-3 h-3 aspect-square bg-[#947B62] rounded-full"></div>
              )}
            </div>
            <span className="text-gray-700 text-left w-full">{option.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
