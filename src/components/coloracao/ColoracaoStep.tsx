import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackToMenuButton from '../shared/BackToMenuButton';
import UrlImageInput from '../shared/UrlImageInput';
import RandomUrlButton from '../shared/RandomUrlButton';
import Loader from '../quiz/Loader';
import AnimationsStyles from '../shared/AnimationsStyles';
import { ColorAnalysisService } from '../../services';
import { useColoracao } from '../../contexts/ColoracaoContext';
import { STEPS_CONFIG } from '../../config/stepsConfig';
import { ColorAnalysisResult, FeatureAnalysis, StepFormState } from '../../types/coloracao';

const ColoracaoStep: React.FC = () => {
  const { stepIndex } = useParams<{ stepIndex: string }>();
  const navigate = useNavigate();
  const { state, formState, updateResult, updateFormState, clearResult } = useColoracao();
  
  const currentStepIndex = parseInt(stepIndex || '0');
  const currentStep = STEPS_CONFIG[currentStepIndex];
  
  if (!currentStep) {
    navigate('/coloracao/0');
    return null;
  }

  // Get existing result and form state for this step
  const existingResult = state[currentStep.stateKey];
  const existingFormState = formState[currentStep.stateKey];

  const [imageUrl, setImageUrl] = useState(existingFormState?.imageUrl || '');
  const [loading, setLoading] = useState(existingFormState?.loading || false);
  const [error, setError] = useState<string | null>(existingFormState?.error || null);
  const [statusText, setStatusText] = useState<string | null>(existingFormState?.statusText || null);
  const [isImageValid, setIsImageValid] = useState(existingFormState?.isImageValid ?? true);

  // Initialize form state from existing state when component mounts or step changes
  useEffect(() => {
    if (existingFormState) {
      setImageUrl(existingFormState.imageUrl || '');
      setLoading(existingFormState.loading || false);
      setError(existingFormState.error || null);
      setStatusText(existingFormState.statusText || null);
      setIsImageValid(existingFormState.isImageValid ?? true);
    } else {
      setImageUrl('');
      setLoading(false);
      setError(null);
      setStatusText(null);
      setIsImageValid(true);
    }
  }, [currentStepIndex]);

  // Wrapper functions to save form state when inputs change
  const handleImageUrlChange = (url: string) => {
    setImageUrl(url);
    updateFormState(currentStep.stateKey, {
      imageUrl: url,
      loading,
      error,
      statusText,
      isImageValid,
    });
  };

  const handleImageValidityChange = (valid: boolean) => {
    setIsImageValid(valid);
    updateFormState(currentStep.stateKey, {
      imageUrl,
      loading,
      error,
      statusText,
      isImageValid: valid,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStatusText(null);
    
    // Save form state to context with loading=true
    updateFormState(currentStep.stateKey, {
      imageUrl,
      loading: true,
      error: null,
      statusText: null,
      isImageValid,
    });

    try {
      const result = await ColorAnalysisService.analyzeImage(
        { url: imageUrl, type: currentStep.type },
        (status) => {
          if (status && status !== 'Completed') {
            setStatusText(status);
            updateFormState(currentStep.stateKey, {
              imageUrl,
              loading: true,
              error: null,
              statusText: status,
              isImageValid,
            });
          }
        }
      );

      if (result) {
        updateResult(currentStep.stateKey, result);
        // Clear form after successful submission
        setImageUrl('');
        setIsImageValid(true);
        // Clear form state after successful result
        updateFormState(currentStep.stateKey, {
          imageUrl: '',
          loading: false,
          error: null,
          statusText: null,
          isImageValid: true,
        });
      } else {
        throw new Error('Não foi possível obter o resultado da análise.');
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Erro desconhecido.';
      setError(errorMsg);
      updateFormState(currentStep.stateKey, {
        imageUrl,
        loading: false,
        error: errorMsg,
        statusText: null,
        isImageValid,
      });
    } finally {
      setLoading(false);
      setStatusText(null);
      // Save form state after completion with loading=false
      updateFormState(currentStep.stateKey, {
        imageUrl,
        loading: false,
        error,
        statusText: null,
        isImageValid,
      });
    }
  };

  const renderColorResult = (featureAnalysis: FeatureAnalysis, title: string) => (
    <div className="mb-4 p-3 bg-white/50 rounded-lg border border-[#947B62]/20 inline-block mx-2">
      <h4 className="font-medium mb-2 text-[#947B62]">{title}:</h4>
      <div className="flex justify-center">
        <div className="flex flex-col items-center">
          <div
            className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
            style={{ backgroundColor: featureAnalysis.color_palette.result }}
            title="Resultado"
          ></div>
        </div>
      </div>
    </div>
  );

  const renderColorPalette = (featureAnalysis: FeatureAnalysis, title: string) => (
    <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <h5 className="font-medium mb-2 text-gray-700">{title}:</h5>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full border shadow-sm"
            style={{ backgroundColor: featureAnalysis.color_palette.average }}
            title="Média"
          ></div>
          <span className="text-xs">Média: {featureAnalysis.color_palette.average}</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full border shadow-sm"
            style={{ backgroundColor: featureAnalysis.color_palette.median }}
            title="Mediana"
          ></div>
          <span className="text-xs">Mediana: {featureAnalysis.color_palette.median}</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full border shadow-sm"
            style={{ backgroundColor: featureAnalysis.color_palette.dark }}
            title="Sombras"
          ></div>
          <span className="text-xs">Sombras: {featureAnalysis.color_palette.dark}</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full border shadow-sm"
            style={{ backgroundColor: featureAnalysis.color_palette.light }}
            title="Luzes"
          ></div>
          <span className="text-xs">Luzes: {featureAnalysis.color_palette.light}</span>
        </div>
        <div className="flex items-center gap-2 col-span-2">
          <div
            className="w-4 h-4 rounded-full border shadow-sm"
            style={{ backgroundColor: featureAnalysis.color_palette.result }}
            title="Resultado"
          ></div>
          <span className="text-xs font-medium">Resultado: {featureAnalysis.color_palette.result}</span>
        </div>
      </div>
    </div>
  );

  const handleTryAgain = () => {
    clearResult(currentStep.stateKey);
    setImageUrl('');
    setLoading(false);
    setError(null);
    setStatusText(null);
    setIsImageValid(true);
    // Clear form state immediately
    updateFormState(currentStep.stateKey, {
      imageUrl: '',
      loading: false,
      error: null,
      statusText: null,
      isImageValid: true,
    });
  };

  const renderResults = () => {
    if (!existingResult) return null;

    return (
      <div className="w-full">        
        {/* Render results based on step type */}
        {existingResult.output.image_url && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-[#947B62]">Imagem Analisada:</h3>
            <img 
              src={existingResult.output.image_url} 
              alt="Imagem analisada" 
              className="max-w-full h-auto rounded-lg shadow-md mx-auto"
              style={{ maxHeight: '300px' }}
            />
          </div>
        )}

        {currentStep.type === 'frente_solto' && 'hair_root' in existingResult.output.result && (
          <>
            {renderColorResult(existingResult.output.result.hair_root, 'Raiz do Cabelo')}
            {renderColorResult(existingResult.output.result.eyebrows, 'Sobrancelhas')}
          </>
        )}
        
        {currentStep.type === 'frente_preso' && 'forehead' in existingResult.output.result && (
          <>
            {renderColorResult(existingResult.output.result.forehead, 'Testa')}
            {renderColorResult(existingResult.output.result.below_mouth, 'Abaixo da Boca')}
            {renderColorResult(existingResult.output.result.mouth, 'Boca')}
            {renderColorResult(existingResult.output.result.chin, 'Queixo')}
          </>
        )}
        
        {currentStep.type === 'perfil' && 'cheek' in existingResult.output.result && (
          <>
            {renderColorResult(existingResult.output.result.cheek, 'Bochecha')}
          </>
        )}
        
        {currentStep.type === 'olho' && 'iris' in existingResult.output.result && (
          <>
            {renderColorResult(existingResult.output.result.under_eye_skin, 'Pele abaixo dos olhos')}
            {renderColorResult(existingResult.output.result.iris, 'Íris')}
          </>
        )}
        
        {currentStep.type === 'pulso' && 'pulse' in existingResult.output.result && (
          <>
            {renderColorResult(existingResult.output.result.pulse, 'Pulso')}
          </>
        )}
      </div>
    );
  };

  const renderLogs = () => {
    if (!existingResult) return null;

    return (
      <details className="mt-4">
        <summary className="cursor-pointer text-[#947B62] font-medium">Logs e Detalhes</summary>
        <div className="mt-2 p-4 rounded-lg">
          {Object.entries(existingResult.output.result).map(([key, value]) => (
            <div key={key} className="mb-6">
              <h4 className="font-medium text-[#947B62] mb-3">{key}:</h4>
              
              {/* Color Palette Details */}
              {renderColorPalette(value, `Paleta de Cores - ${key}`)}
              
              {/* Uploaded Images */}
              {value.uploaded_images && (
                <div className="mt-3">
                  <h5 className="font-medium text-gray-700 mb-2">Imagens Geradas:</h5>
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {Object.entries(value.uploaded_images).map(([imageKey, imageUrl]) => (
                      <li key={imageKey}>
                        <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{imageKey}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </details>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-[#FAFAFA]">
      <BackToMenuButton />
      
      {/* Navigation */}
      <div className="flex gap-2 z-20 mb-4">
        {STEPS_CONFIG.map((_, index) => (
          <button
            key={index}
            onClick={() => navigate(`/coloracao/${index}`)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              index === currentStepIndex
                ? 'bg-[#947B62] text-white'
                : 'bg-white/80 text-[#947B62] hover:bg-white'
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => navigate('/coloracao/resultados')}
          className="px-3 py-1 rounded-full text-sm font-medium bg-[#947B62] text-white hover:bg-[#7a624e] transition-colors"
        >
          Extrações
        </button>
      </div>

      <div className="relative z-10 bg-white/90 rounded-2xl shadow-2xl border border-[#947B62] p-10 max-w-lg w-full text-center flex flex-col items-center transition-all duration-300">
        {/* Show results if they exist */}
        {existingResult ? (
          <>
            <h1 className="text-4xl font-bold font-fraunces text-[#947B62] drop-shadow-sm">
              Extração Concluída
            </h1>
            <h2 className="text-2xl font-medium mb-4">{currentStep.title}</h2>
            {renderResults()}
            {renderLogs()}
            <button
              onClick={handleTryAgain}
              className="mt-6 px-8 py-3 rounded-xl bg-gray-600 text-white font-semibold hover:bg-gray-700 transition-colors shadow focus:ring-4"
            >
              Tentar Novamente
            </button>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold font-fraunces mb-3 text-[#947B62] drop-shadow-sm">
              {currentStep.title}
            </h1>
            <p className="text-gray-700 mb-7 text-base">
              {currentStep.description} Cole a URL da sua imagem abaixo para extrair as cores para análise.
            </p>
            
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
              <UrlImageInput
                imageUrl={imageUrl}
                onImageUrlChange={handleImageUrlChange}
                isImageValid={isImageValid}
                onImageValidityChange={handleImageValidityChange}
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
            
            {!imageUrl && !loading && (
              <div className="mt-5">
                <RandomUrlButton
                  onGetRandomUrl={() => {
                    const randomUrl = currentStep.imageUrls[Math.floor(Math.random() * currentStep.imageUrls.length)];
                    handleImageUrlChange(randomUrl);
                    handleImageValidityChange(true);
                  }}
                />
              </div>
            )}
            
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </>
        )}
      </div>
      <AnimationsStyles />
    </div>
  );
};

export default ColoracaoStep;
