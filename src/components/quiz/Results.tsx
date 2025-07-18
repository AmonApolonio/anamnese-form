import React from 'react';
import { StyleType } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo } from '@fortawesome/free-solid-svg-icons';

interface ResultsProps {
  styles: StyleType[];
  onRestart: () => void;
  photoResults?: { file: File; result: string; tags?: string[] }[];
}

const Results: React.FC<ResultsProps> = ({ styles, onRestart, photoResults }) => {
  // Sort styles by score in descending order
  const sortedStyles = [...styles].sort((a, b) => b.score - a.score);
  const totalScore = styles.reduce((sum, style) => sum + style.score, 0);

  // Only show up to 3 styles with percentage > 0
  const stylesWithPercentage = sortedStyles
    .map(style => ({
      ...style,
      percentage: totalScore > 0 ? Math.round((style.score / totalScore) * 100) : 0
    }))
    .filter(style => style.percentage > 0)
    .slice(0, 3);

  return (
    <div className="bg-white rounded-lg shadow p-8 max-w-xl mx-auto mb-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Seus Estilos Predominantes
      </h1>
      <div className="flex flex-col gap-6">
        {stylesWithPercentage.map((style, index) => (
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
                {style.percentage}%
              </span>
            </div>
            <p className="mt-2 text-gray-600">{style.description}</p>
          </div>
        ))}
      </div>
      {/* Show photo results as a grid if available */}
      {photoResults && photoResults.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Resultados das Fotos</h2>
          <div className="grid grid-cols-2 gap-4 w-full mb-4">
            {photoResults.map((photo, idx) => (
              <div key={idx} className="flex flex-col items-center bg-[#F5F0EA] rounded-lg p-3 border border-[#947B62]">
                <img
                  src={URL.createObjectURL(photo.file)}
                  alt={`Foto ${idx + 1}`}
                  className="w-full h-40 object-cover rounded mb-2"
                  style={{ maxWidth: '180px' }}
                />
                <span className="font-semibold text-[#947B62] text-center">{photo.result}</span>
                {photo.tags && photo.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2 justify-center">
                    {photo.tags.map((tag, tagIdx) => (
                      <span key={tagIdx} className="bg-[#947B62] text-white text-xs rounded px-2 py-1 mr-1 mb-1">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
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
