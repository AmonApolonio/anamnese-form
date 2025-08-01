import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackToMenuButton from '../shared/BackToMenuButton';
import AnimationsStyles from '../shared/AnimationsStyles';
import { useColoracao } from '../../contexts/ColoracaoContext';
import { FinalAnalysisResult } from '../../types/coloracaoResults';
import ColorExtractionsTab from './ColorExtractionsTab';
import AnalysisResultsTab from './AnalysisResultsTab';

const ColoracaoResults: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useColoracao();
  const [finalResults, setFinalResults] = useState<FinalAnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'extractions' | 'results'>('extractions');

  const totalTests = 5;
  const completedTests = Object.values(state).filter(result => result !== undefined).length;

  const handleAnalysisComplete = (result: FinalAnalysisResult) => {
    setFinalResults(result);
    setActiveTab('results');
  };

  const handleTryAgain = () => {
    setFinalResults(null);
    setActiveTab('extractions');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-[#FAFAFA]">
      <BackToMenuButton />
      
      {/* Navigation back to steps */}
      <div className="flex gap-2 z-20 mb-4">
        {[0, 1, 2, 3, 4].map((index) => (
          <button
            key={index}
            onClick={() => navigate(`/coloracao/${index}`)}
            className="px-3 py-1 rounded-full text-sm font-medium bg-white/80 text-[#947B62] hover:bg-white transition-colors"
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => setActiveTab('extractions')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            activeTab === 'extractions' 
              ? 'bg-[#947B62] text-white' 
              : 'bg-white/80 text-[#947B62] hover:bg-white'
          }`}
        >
          Extrações
        </button>
        {finalResults && (
          <button
            onClick={() => setActiveTab('results')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'results' 
                ? 'bg-[#947B62] text-white' 
                : 'bg-white/80 text-[#947B62] hover:bg-white'
            }`}
          >
            Resultados
          </button>
        )}
      </div>

      <div className="relative z-10 bg-white/90 rounded-2xl shadow-2xl border border-[#947B62] p-10 max-w-6xl w-full text-center flex flex-col items-center transition-all duration-300">
        <h1 className="text-4xl font-bold font-fraunces mb-6 text-[#947B62] drop-shadow-sm">
          {activeTab === 'extractions' ? 'Extrações da Análise de Cores' : 'Resultados da Análise'}
        </h1>
        
        {activeTab === 'extractions' ? (
          <ColorExtractionsTab onAnalysisComplete={handleAnalysisComplete} />
        ) : (
          finalResults && (
            <div className="w-full text-left">
              <AnalysisResultsTab 
                finalResults={finalResults} 
                onTryAgain={handleTryAgain}
              />
            </div>
          )
        )}
      </div>
      
      <AnimationsStyles />
    </div>
  );
};

export default ColoracaoResults;
