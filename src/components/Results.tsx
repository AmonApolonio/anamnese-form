import React from 'react';
import { StyleType } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo } from '@fortawesome/free-solid-svg-icons';

interface ResultsProps {
  styles: StyleType[];
  onRestart: () => void;
}

const Results: React.FC<ResultsProps> = ({ styles, onRestart }) => {
  // Sort styles by score in descending order
  const sortedStyles = [...styles].sort((a, b) => b.score - a.score);
  const topStyles = sortedStyles.slice(0, 3);
  const totalScore = styles.reduce((sum, style) => sum + style.score, 0);

  return (
    <div className="bg-white rounded-lg shadow p-8 max-w-xl mx-auto mb-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Seus Estilos Predominantes
      </h1>
      <div className="flex flex-col gap-6">
        {topStyles.map((style, index) => {
          const percentage =
            totalScore > 0 ? Math.round((style.score / totalScore) * 100) : 0;
          return (
            <div
              key={style.id}
              className={`p-5 rounded-lg ${
                index === 0 ? 'bg-[#F5F0EA]' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-700">
                  {style.name}
                </h2>
                <span className="text-lg font-bold text-[#947B62]">
                  {percentage}%
                </span>
              </div>
              <p className="mt-2 text-gray-600">{style.description}</p>
            </div>
          );
        })}
      </div>
      <button
        onClick={onRestart}
        className="mt-8 flex items-center px-6 py-2 rounded-lg bg-[#947B62] text-white font-semibold hover:bg-[#7a624e] transition-colors mx-auto"
      >
        <FontAwesomeIcon icon={faRedo} className="mr-2" />
        Refazer Quiz
      </button>
    </div>
  );
};

export default Results;
