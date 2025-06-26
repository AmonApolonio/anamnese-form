import React from 'react';
import { useNavigate } from 'react-router-dom';

interface WelcomeProps {
  onStart: () => void;
  onSkipToPhotoUpload: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onStart, onSkipToPhotoUpload }) => {
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-xl mx-auto mb-6 text-center" style={{ backgroundColor: '#FAFAFA' }}>
      <div className="mb-8 flex justify-center">
        <div className="h-20 w-20 rounded-full bg-[#947B62] flex items-center justify-center">
          {/* Inline SVG icon */}
          <svg width="48" height="48" viewBox="0 0 98 103" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-12 w-12">
            <path d="M61.5161 55.0606C56.2799 55.362 51.8348 59.8835 51.6088 65.1396L49.9512 102.291L54.7731 99.9547L62.4202 74.9172C63.8517 70.2451 67.6376 66.4584 72.29 65.0831L97.0019 57.6981L98.0002 52.9694L61.5161 55.0606Z" fill="white"/>
            <path d="M36.597 55.0606L0.112976 52.9694L1.11125 57.6981L25.8232 65.0831C30.4755 66.4772 34.2614 70.2451 35.6929 74.9172L43.3401 99.9547L48.1619 102.291L46.5044 65.1396C46.2784 59.8835 41.8144 55.362 36.597 55.0606Z" fill="white"/>
            <path d="M61.4031 48.0147L97.8871 50.2942L96.9077 45.5655L72.2334 38.0487C67.581 36.6357 63.8328 32.849 62.4202 28.158L54.886 3.08285L50.083 0.727936L51.5522 37.8791C51.7594 43.1353 56.1857 47.6755 61.4219 48.0147H61.4031Z" fill="white"/>
            <path d="M35.6929 28.0261C34.2426 32.6983 30.4378 36.4473 25.7855 37.8226L1.01703 45.0946L-7.62939e-05 49.8232L36.5028 47.9016C41.739 47.619 46.203 43.1164 46.4667 37.8603L48.3125 0.709106L43.4719 3.00751L35.6929 28.0073V28.0261Z" fill="white"/>
          </svg>
        </div>
      </div>
      <div className="flex flex-col gap-8">
        {/* First item: Descubra Seu Estilo */}
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h1 className="text-3xl font-bold font-fraunces mb-4 text-gray-800">Descubra Seu Estilo</h1>
          <p className="text-gray-600 mb-8">Responda algumas perguntas rápidas para descobrir seus estilos predominantes e receber recomendações personalizadas.</p>
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={onStart}
              className="px-8 py-3 rounded-lg bg-[#947B62] text-white font-semibold hover:bg-[#7a624e] transition-colors"
            >
              Começar Quiz
            </button>
            <button
              onClick={onSkipToPhotoUpload}
              className="px-8 py-3 rounded-lg border-2 border-[#947B62] text-[#947B62] font-semibold bg-white hover:bg-[#f5f0ea] transition-colors"
            >
              Começar Quiz pelas fotos
            </button>
          </div>
        </div>
        {/* Second item: Remova o fundo das suas fotos */}
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-2xl font-bold font-fraunces mb-4 text-gray-800">Remova o fundo das suas fotos</h2>
          <p className="text-gray-600 mb-8">Transforme suas imagens em segundos com fundo transparente, pronto para montagens, designs ou apresentações.</p>
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={() => navigate('/remove-bg')}
              className="px-8 py-3 rounded-lg bg-[#947B62] text-white font-semibold hover:bg-[#7a624e] transition-colors"
            >
              Experimentar agora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
