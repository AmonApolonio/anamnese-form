import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackToMenuButton from './BackToMenuButton';

// List of random image URLs (populate as needed)
const RANDOM_IMAGE_URLS = [
  'https://tantto-assinaturas.s3.us-east-1.amazonaws.com/gennie-mock/vestido1.jpg',
  'https://tantto-assinaturas.s3.us-east-1.amazonaws.com/gennie-mock/vestido2.jpg',
  'https://tantto-assinaturas.s3.us-east-1.amazonaws.com/gennie-mock/vestido3.jpg',
  'https://tantto-assinaturas.s3.us-east-1.amazonaws.com/gennie-mock/vestido4.jpg',
  'https://tantto-assinaturas.s3.us-east-1.amazonaws.com/gennie-mock/vestido5.jpg',
  'https://tantto-assinaturas.s3.us-east-1.amazonaws.com/gennie-mock/vestido6.jpg',
  'https://tantto-assinaturas.s3.us-east-1.amazonaws.com/gennie-mock/vestido7.jpg',
  'https://tantto-assinaturas.s3.us-east-1.amazonaws.com/gennie-mock/vestido8.jpg',
  'https://tantto-assinaturas.s3.us-east-1.amazonaws.com/gennie-mock/vestido9.jpg',
];

const RemoveBg: React.FC = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isImageValid, setIsImageValid] = useState(true);
  const [statusText, setStatusText] = useState<string | null>(null);
  const navigate = useNavigate();

  // Helper to poll for result
  const pollForResult = async (id: string, controller: AbortController) => {
    let attempts = 0;
    while (attempts < 60) {
      try {
        const response = await fetch(import.meta.env.VITE_N8N_POST_URL3, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
          signal: controller.signal
        });
        if (response.headers.get('content-type')?.startsWith('image/')) {
          setStatusText(null);
          const blob = await response.blob();
          return { image: URL.createObjectURL(blob) };
        }
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
            setStatusText('Processando...');
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
    setResultUrl(null);
    setStatusText(null);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 180000); // 3 minutes
    try {
      // Step 1: Submit image URL
      const response = await fetch(import.meta.env.VITE_N8N_POST_URL2, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: imageUrl }),
        signal: controller.signal
      });
      if (!response.ok) throw new Error('Erro ao processar a imagem.');
      const data = await response.json();
      if (!data?.id) throw new Error('Resposta inesperada do servidor.');
      const id = data.id;
      // Step 2: Poll for result
      const pollResult = await pollForResult(id, controller);
      if (pollResult?.image) {
        setResultUrl(pollResult.image);
      } else {
        throw new Error('Não foi possível obter a imagem processada.');
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
      {/* Back to main menu button (inside card, above title) */}
      <BackToMenuButton />
      {/* Decorative background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-10" />
      <div className="relative z-10 bg-white/90 rounded-2xl shadow-2xl border border-[#947B62] p-10 max-w-lg w-full text-center flex flex-col items-center transition-all duration-300">
        <h1 className="text-4xl font-bold font-fraunces mb-3 text-[#947B62] drop-shadow-sm">Remova o fundo da sua foto</h1>
        <p className="text-gray-700 mb-7 text-base">Cole a URL da sua imagem abaixo para remover o fundo automaticamente.</p>
        <div className="w-full flex-1 flex flex-col justify-center">
          <form
            onSubmit={handleSubmit}
            className={`flex flex-col gap-5 w-full ${resultUrl ? 'hidden' : ''}`}
          >
            <div className="relative w-full">
              <input
                type="url"
                required
                placeholder="Cole a URL da imagem aqui..."
                value={imageUrl}
                onChange={e => {
                  setImageUrl(e.target.value);
                  setIsImageValid(true);
                }}
                className="px-5 py-3 pr-12 rounded-xl bg-white border-2 border-[#947B62] focus:outline-none focus:ring-4 focus:ring-[#947B62]/30 transition-all w-full text-gray-800 shadow-sm placeholder:text-gray-400"
              />
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => { setImageUrl(''); setIsImageValid(true); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-[#f3ede7] hover:bg-[#e5dbce] text-[#947B62] transition-colors shadow focus:outline-none"
                  title="Limpar campo"
                  tabIndex={0}
                >
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M6 6l8 8M6 14L14 6" stroke="#947B62" strokeWidth="2" strokeLinecap="round"/></svg>
                </button>
              )}
            </div>
            {imageUrl && isImageValid && (
              <img
                src={imageUrl}
                alt="Pré-visualização"
                className="mx-auto rounded-xl shadow-lg max-h-52 object-contain border-2 border-[#947B62]/30 bg-gray-50 transition-all duration-300 animate-fadein"
                style={{ marginTop: 8 }}
                onError={() => setIsImageValid(false)}
                onLoad={() => setIsImageValid(true)}
              />
            )}
            {imageUrl && !isImageValid && (
              <div className="text-red-500 text-sm font-medium animate-fadein">Não foi possível carregar a imagem. Verifique se a URL é válida e acessível.</div>
            )}
            {/* Only show remove button if input is not empty */}
            {imageUrl && (
              <button
                type="submit"
                className="px-8 py-3 rounded-xl bg-[#947B62] text-white font-semibold shadow hover:bg-[#7a624e] focus:ring-4 focus:ring-[#947B62]/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={loading || !imageUrl || !isImageValid}
              >
                {loading ? (
                  <span className="flex flex-col items-center justify-center gap-2">
                    {/* Enhanced SVG Loader: Two animated circles */}
                    <span className="relative w-10 h-10 inline-block">
                      <svg className="absolute top-0 left-0 animate-spin-smooth" width="40" height="40" viewBox="0 0 50 50">
                        <defs>
                          <linearGradient id="loader-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#947B62" />
                            <stop offset="100%" stopColor="#e5dbce" />
                          </linearGradient>
                        </defs>
                        <circle
                          cx="25"
                          cy="25"
                          r="20"
                          fill="none"
                          stroke="url(#loader-gradient)"
                          strokeWidth="5"
                          strokeLinecap="round"
                          strokeDasharray="90 150"
                          opacity="0.8"
                        />
                      </svg>
                      <svg className="absolute top-0 left-0 animate-spin-reverse" width="40" height="40" viewBox="0 0 50 50">
                        <circle
                          cx="25"
                          cy="25"
                          r="15"
                          fill="none"
                          stroke="#e5dbce"
                          strokeWidth="3"
                          strokeDasharray="40 60"
                          opacity="0.7"
                        />
                      </svg>
                    </span>
                    <span className="ml-2 animate-pulse-text">{statusText || 'Processando...'}</span>
                  </span>
                ) : 'Remover Fundo'}
              </button>
            )}
          </form>
          {/* Show random button if input is empty and not loading */}
          {!resultUrl && !imageUrl && !loading && (
            <button
              type="button"
              className="px-8 py-3 rounded-xl bg-[#947B62] text-white font-semibold shadow hover:bg-[#7a624e] focus:ring-4 focus:ring-[#947B62]/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-5"
              onClick={() => {
                const randomUrl = RANDOM_IMAGE_URLS[Math.floor(Math.random() * RANDOM_IMAGE_URLS.length)];
                setImageUrl(randomUrl);
                setIsImageValid(true);
              }}
            >
              Obter URL Aleatória
            </button>
          )}
          {error && <div className="text-red-500 mt-5 animate-fadein font-medium">{error}</div>}
          {/* Result section, always rendered but hidden if not active */}
          <div className={`${resultUrl ? '' : 'hidden'} animate-fadein w-full`}>
            <h2 className="text-xl font-semibold mb-3 text-[#947B62]">Imagem com fundo removido:</h2>
            {resultUrl && (
              <div className="relative flex justify-center items-center w-full">
                <div className="relative" style={{display: 'inline-block', maxWidth: '100%', width: 'auto'}}>
                  <div className="absolute inset-0 z-0 rounded-xl overflow-hidden animate-gradient-move" style={{filter: 'blur(16px)', opacity: 0.7, width: '100%', height: '100%'}} />
                  <img src={resultUrl} alt="Resultado" className="relative z-10 mx-auto rounded-xl shadow-2xl border-2 border-[#947B62]/40 max-h-96" style={{ background: 'transparent', display: 'block', maxWidth: '100%', height: 'auto' }} />
                </div>
              </div>
            )}
            <div className="flex justify-center gap-3 mt-5">
              {resultUrl && (
                <a href={resultUrl} download className="px-7 py-2.5 rounded-xl bg-[#947B62] text-white font-semibold hover:bg-[#7a624e] transition-colors shadow flex items-center gap-2">Baixar imagem</a>
              )}
              <button
                onClick={() => { setResultUrl(null); setImageUrl(''); setError(null); }}
                className="px-3 py-2 rounded-xl bg-[#f3ede7] text-[#947B62] hover:bg-[#e5dbce] transition-colors shadow flex items-center"
                title="Tentar outra imagem"
              >
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path stroke="#947B62" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582M20 20v-5h-.581M5.5 9A7 7 0 0 1 12 5c3.314 0 6.065 2.343 6.918 5.5M18.5 15A7 7 0 0 1 12 19c-3.314 0-6.065-2.343-6.918-5.5"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
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
        /* Moving gradient animation - now a constant wave */
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
    </div>
  );
};

export default RemoveBg;
