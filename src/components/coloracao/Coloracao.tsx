import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackToMenuButton from '../shared/BackToMenuButton';
import UrlImageInput from '../shared/UrlImageInput';
import RandomUrlButton from '../shared/RandomUrlButton';
import Loader from '../quiz/Loader';
import AnimationsStyles from '../shared/AnimationsStyles';

interface FeatureAnalysis {
  color_palette: {
    average: string;
    dark: string;
    light: string;
    median: string;
  };
  region: number[][];
  uploaded_images: {
    cropped_url: string;
    filtered_url: string;
    palette_url: string;
  };
}

interface ColorAnalysisResult {
  output: {
    image_url: string;
    result: {
      eyebrows: FeatureAnalysis;
      hair_root: FeatureAnalysis;
    };
  };
}

const FRENTE_SOLTO_IMAGE_URLS = [
  'https://tantto-assinaturas.s3.us-east-1.amazonaws.com/gennie-mock/frente_solto.png',
];

const Coloracao: React.FC = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [resultPalette, setResultPalette] = useState<ColorAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [isImageValid, setIsImageValid] = useState(true);
  const navigate = useNavigate();

  // Helper to poll for result
  const pollForResult = async (id: string, controller: AbortController) => {
    let attempts = 0;
    while (attempts < 60) {
      try {
        const response = await fetch(import.meta.env.VITE_COLOR_ANALYSIS_POLL_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
          signal: controller.signal
        });

        let data;
        try {
          data = await response.json();
        } catch (jsonErr) {
          setStatusText(null);
          throw new Error('Erro inesperado ao processar a resposta do servidor.');
        }

        if (data && typeof data === 'object' && data.status === 'FAILED') {
          console.log('N8N status (object):', data.status, data);
          setStatusText(null);
          let details = '';
          if (data.output && data.output.details && Array.isArray(data.output.details)) {
            details = data.output.details.join(' ');
          }
          throw new Error('Processamento falhou: ' + (details || data.error || 'Erro desconhecido.'));
        }

        // Only handle single object with status (not array)
        if (data && typeof data === 'object' && typeof data.status === 'string') {
          console.log('N8N status (single object):', data.status, data);
          if (data.status === 'IN_QUEUE') {
            setStatusText('Na fila..');
            await new Promise(res => setTimeout(res, 10000)); // 10s
            attempts++;
            continue;
          } else if (data.status === 'IN_PROGRESS') {
            setStatusText('Processando...');
            await new Promise(res => setTimeout(res, 5000)); // 5s
            attempts++;
            continue;
          } else if (data.status === 'COMPLETED') {
            setStatusText('Finalizando...');
            // Check if we have the complete result with output
            if (data.output && data.output.result) {
              setStatusText(null);
              return data as ColorAnalysisResult;
            }
            attempts++;
            continue;
          } else if (data.status === 'FAILED') {
            setStatusText(null);
            let details = '';
            if (data.output && data.output.details && Array.isArray(data.output.details)) {
              details = data.output.details.join(' ');
            }
            throw new Error('Processamento falhou: ' + (details || data.error || 'Erro desconhecido.'));
          } else if (data.status === 'CANCELLED') {
            setStatusText(null);
            throw new Error('Processamento foi cancelado.');
          } else {
            setStatusText(null);
            throw new Error('Erro inesperado: ' + (data.error || 'Status desconhecido.'));
          }
        } 
        // Check if we got the complete result without status (final response)
        else if (data && data.output && data.output.result) {
          console.log('N8N complete result:', data);
          setStatusText(null);
          return data as ColorAnalysisResult;
        } else {
          console.log('N8N status (unknown):', data);
          setStatusText(null);
          throw new Error('Erro inesperado do servidor.');
        }
        attempts++;
      } catch (err: any) {
        setStatusText(null);
        throw err;
      }
    }
    setStatusText(null);
    throw new Error('Tempo limite atingido ao aguardar o processamento.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResultPalette(null);
    setStatusText(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 180000); // 3 minutes

    try {
      // Step 1: Submit image URL with type
      const response = await fetch(import.meta.env.VITE_COLOR_ANALYSIS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: imageUrl, type: 'frente_solto' }),
        signal: controller.signal
      });

      if (!response.ok) throw new Error('Erro ao processar a imagem.');

      const data = await response.json();
      if (!data?.id) throw new Error('Resposta inesperada do servidor.');

      const id = data.id;

      // Step 2: Poll for result
      const pollResult = await pollForResult(id, controller);
      if (pollResult) {
        setResultPalette(pollResult);
      } else {
        throw new Error('Não foi possível obter o resultado da análise.');
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Tempo limite atingido (3 minutos). Tente novamente mais tarde.');
      } else {
        setError(err.message || 'Erro desconhecido.');
      }
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
      setStatusText(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-[#FAFAFA]">
      <BackToMenuButton />
      <div className="relative z-10 bg-white/90 rounded-2xl shadow-2xl border border-[#947B62] p-10 max-w-lg w-full text-center flex flex-col items-center transition-all duration-300">
        <h1 className="text-4xl font-bold font-fraunces mb-3 text-[#947B62] drop-shadow-sm">Foto de Frente – Solto</h1>
        <p className="text-gray-700 mb-7 text-base">Cabelo solto, rosto centralizado e luz natural. Cole a URL da sua imagem abaixo para descobrir sua paleta de cores personalizada.</p>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <UrlImageInput
            imageUrl={imageUrl}
            onImageUrlChange={setImageUrl}
            isImageValid={isImageValid}
            onImageValidityChange={setIsImageValid}
            placeholder="Cole a URL da imagem aqui"
            disabled={loading}
          />
          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-[#947B62] text-white font-semibold hover:bg-[#7a624e] transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow focus:ring-4 focus:ring-[#947B62]/30"
            disabled={loading || !imageUrl || !isImageValid}
            style={{ display: imageUrl ? 'block' : 'none' }}
          >
            {loading ? <Loader statusText={statusText} /> : 'Confirmar'}
          </button>
        </form>
        
        {/* Show random button if input is empty and not loading */}
        {!imageUrl && !loading && !resultPalette && (
          <div className="mt-5">
            <RandomUrlButton
              onGetRandomUrl={() => {
                const randomUrl = FRENTE_SOLTO_IMAGE_URLS[Math.floor(Math.random() * FRENTE_SOLTO_IMAGE_URLS.length)];
                setImageUrl(randomUrl);
                setIsImageValid(true);
              }}
            />
          </div>
        )}
        
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {resultPalette && (
          <div className="mt-6 w-full">
            <h2 className="text-2xl font-bold mb-4 text-[#947B62]">Análise de Cores:</h2>
            
            {/* Original Image */}
            {resultPalette.output.image_url && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-[#947B62]">Imagem Analisada:</h3>
                <img 
                  src={resultPalette.output.image_url} 
                  alt="Imagem analisada" 
                  className="max-w-full h-auto rounded-lg shadow-md mx-auto"
                  style={{ maxHeight: '300px' }}
                />
              </div>
            )}

            {/* Hair Root Analysis */}
            <div className="mb-6 p-4 bg-white/50 rounded-lg border border-[#947B62]/20">
              <h3 className="text-lg font-semibold mb-3 text-[#947B62]">Análise da Raiz do Cabelo:</h3>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <h4 className="font-medium mb-2">Paleta de Cores:</h4>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-8 h-8 rounded-full border shadow-sm"
                        style={{ backgroundColor: resultPalette.output.result.hair_root.color_palette.average }}
                        title="Média"
                      ></div>
                      <span className="text-xs mt-1">Média</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div
                        className="w-8 h-8 rounded-full border shadow-sm"
                        style={{ backgroundColor: resultPalette.output.result.hair_root.color_palette.dark }}
                        title="Escuro"
                      ></div>
                      <span className="text-xs mt-1">Escuro</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div
                        className="w-8 h-8 rounded-full border shadow-sm"
                        style={{ backgroundColor: resultPalette.output.result.hair_root.color_palette.light }}
                        title="Claro"
                      ></div>
                      <span className="text-xs mt-1">Claro</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div
                        className="w-8 h-8 rounded-full border shadow-sm"
                        style={{ backgroundColor: resultPalette.output.result.hair_root.color_palette.median }}
                        title="Mediana"
                      ></div>
                      <span className="text-xs mt-1">Mediana</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <a 
                      href={resultPalette.output.result.hair_root.uploaded_images.cropped_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm underline block"
                    >
                      Ver região cortada
                    </a>
                  </div>
                  <div>
                    <a 
                      href={resultPalette.output.result.hair_root.uploaded_images.filtered_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm underline block"
                    >
                      Ver imagem filtrada
                    </a>
                  </div>
                  <div>
                    <a 
                      href={resultPalette.output.result.hair_root.uploaded_images.palette_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm underline block"
                    >
                      Ver paleta gerada
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Eyebrows Analysis */}
            <div className="mb-6 p-4 bg-white/50 rounded-lg border border-[#947B62]/20">
              <h3 className="text-lg font-semibold mb-3 text-[#947B62]">Análise das Sobrancelhas:</h3>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <h4 className="font-medium mb-2">Paleta de Cores:</h4>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-8 h-8 rounded-full border shadow-sm"
                        style={{ backgroundColor: resultPalette.output.result.eyebrows.color_palette.average }}
                        title="Média"
                      ></div>
                      <span className="text-xs mt-1">Média</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div
                        className="w-8 h-8 rounded-full border shadow-sm"
                        style={{ backgroundColor: resultPalette.output.result.eyebrows.color_palette.dark }}
                        title="Escuro"
                      ></div>
                      <span className="text-xs mt-1">Escuro</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div
                        className="w-8 h-8 rounded-full border shadow-sm"
                        style={{ backgroundColor: resultPalette.output.result.eyebrows.color_palette.light }}
                        title="Claro"
                      ></div>
                      <span className="text-xs mt-1">Claro</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div
                        className="w-8 h-8 rounded-full border shadow-sm"
                        style={{ backgroundColor: resultPalette.output.result.eyebrows.color_palette.median }}
                        title="Mediana"
                      ></div>
                      <span className="text-xs mt-1">Mediana</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <a 
                      href={resultPalette.output.result.eyebrows.uploaded_images.cropped_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm underline block"
                    >
                      Ver região cortada
                    </a>
                  </div>
                  <div>
                    <a 
                      href={resultPalette.output.result.eyebrows.uploaded_images.filtered_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm underline block"
                    >
                      Ver imagem filtrada
                    </a>
                  </div>
                  <div>
                    <a 
                      href={resultPalette.output.result.eyebrows.uploaded_images.palette_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm underline block"
                    >
                      Ver paleta gerada
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <AnimationsStyles />
    </div>
  );
};

export default Coloracao;
