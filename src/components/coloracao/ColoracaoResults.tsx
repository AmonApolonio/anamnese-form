import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackToMenuButton from '../shared/BackToMenuButton';
import AnimationsStyles from '../shared/AnimationsStyles';
import Loader from '../quiz/Loader';
import { useColoracao } from '../../contexts/ColoracaoContext';
import { FeatureAnalysis, ColorAnalysisResult } from '../../types/coloracao';
import { ColorAnalysisService } from '../../services';

interface FinalAnalysisResult {
  seasonal_classification: {
    primary_season: string;
    alternative_seasons: string[];
    confidence_percentage: number;
    explanation: string;
  };
  dimensional_analysis: {
    temperature: {
      hue: number;
      classification: string;
      approximate: boolean;
    };
    lightness: {
      L_value: number;
      classification: string;
      approximate: boolean;
    };
    chroma: {
      C_value: number;
      classification: string;
      approximate: boolean;
    };
    contrast: {
      skin_L: number;
      hair_L: number;
      delta_l: number;
      classification: string;
      very_low: boolean;
    };
  };
  color_summaries: {
    skin: {
      lightness: number;
      chroma: number;
      hue: number;
      hex: string;
    };
    hair: {
      lightness: number;
      chroma: number;
      hue: number;
      hex: string;
    };
    eye: {
      lightness: number;
      chroma: number;
      hue: number;
      hex: string;
    };
  };
  approximation_flags: string[];
}

const ColoracaoResults: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useColoracao();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState<string>('');
  const [finalResults, setFinalResults] = useState<FinalAnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'extractions' | 'results'>('extractions');
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [preloadedImages, setPreloadedImages] = useState<Record<string, boolean>>({});
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);
  const [currentImageSrc, setCurrentImageSrc] = useState<string>('');

  const totalTests = 5; // Total number of tests
  const completedTests = Object.values(state).filter(result => result !== undefined).length;
  const progressPercentage = (completedTests / totalTests) * 100;

  // Preload images when component mounts or state changes
  React.useEffect(() => {
    const imagesToPreload = [
      state.frenteSolto?.output?.image_url,
      state.frentePreso?.output?.image_url,
      state.perfil?.output?.image_url,
      state.olhos?.output?.image_url,
      state.pulso?.output?.image_url,
    ].filter(Boolean) as string[];

    imagesToPreload.forEach((imageUrl) => {
      if (imageUrl && !preloadedImages[imageUrl]) {
        const img = new Image();
        img.onload = () => {
          setPreloadedImages(prev => ({ ...prev, [imageUrl]: true }));
        };
        img.onerror = () => {
          console.warn(`Failed to preload image: ${imageUrl}`);
        };
        img.src = imageUrl;
      }
    });
  }, [state]);

  // Initialize current image when component mounts
  React.useEffect(() => {
    if (state.frenteSolto?.output?.image_url && !currentImageSrc) {
      setCurrentImageSrc(state.frenteSolto.output.image_url);
    }
  }, [state.frenteSolto?.output?.image_url, currentImageSrc]);

  // Handle image transition effect
  const handleImageHover = (newState: string | null) => {
    if (newState !== hoveredState) {
      const newImageUrl = newState && state[newState]?.output?.image_url 
        ? state[newState].output.image_url 
        : state.frenteSolto?.output?.image_url;
      
      if (newImageUrl && newImageUrl !== currentImageSrc) {
        setHoveredState(newState);
        
        // Check if image is already preloaded
        if (preloadedImages[newImageUrl]) {
          // Image is ready, change immediately
          setCurrentImageSrc(newImageUrl);
        } else {
          // Image not preloaded, show loading state
          setIsImageLoading(true);
          
          // Preload the specific image
          const img = new Image();
          img.onload = () => {
            setPreloadedImages(prev => ({ ...prev, [newImageUrl]: true }));
            setCurrentImageSrc(newImageUrl);
            setIsImageLoading(false);
          };
          img.onerror = () => {
            console.warn(`Failed to load image: ${newImageUrl}`);
            setIsImageLoading(false);
          };
          img.src = newImageUrl;
        }
      } else {
        setHoveredState(newState);
      }
    }
  };

  const renderColorPalette = (featureAnalysis: FeatureAnalysis, title: string) => (
    <div className="mb-4 p-4 bg-white/70 rounded-lg border border-[#947B62]/30">
      <h4 className="font-semibold mb-3 text-[#947B62] text-lg">{title}</h4>
      <div className="flex flex-wrap gap-3">
        <div className="flex flex-col items-center">
          <div
            className="w-10 h-10 rounded-full border-2 border-white shadow-lg"
            style={{ backgroundColor: featureAnalysis.color_palette.median }}
            title="Mediana"
          ></div>
          <span className="text-sm mt-2 font-medium">Mediana</span>
        </div>
        <div className="flex flex-col items-center">
          <div
            className="w-10 h-10 rounded-full border-2 border-white shadow-lg"
            style={{ backgroundColor: featureAnalysis.color_palette.dark }}
            title="Sombras"
          ></div>
          <span className="text-sm mt-2 font-medium">Sombras</span>
        </div>
        <div className="flex flex-col items-center">
          <div
            className="w-10 h-10 rounded-full border-2 border-white shadow-lg"
            style={{ backgroundColor: featureAnalysis.color_palette.average }}
            title="Média"
          ></div>
          <span className="text-sm mt-2 font-medium">Média</span>
        </div>
        <div className="flex flex-col items-center">
          <div
            className="w-10 h-10 rounded-full border-2 border-white shadow-lg"
            style={{ backgroundColor: featureAnalysis.color_palette.light }}
            title="Luzes"
          ></div>
          <span className="text-sm mt-2 font-medium">Luzes</span>
        </div>
      </div>
    </div>
  );

  const renderTestState = (testKey: keyof typeof state, label: string) => {
    const isCompleted = state[testKey] !== undefined;
    return (
      <div className="flex items-center gap-2">
        <span className={`text-sm font-medium ${isCompleted ? 'text-green-600' : 'text-gray-500'}`}>{label}</span>
        <span className={`text-xs px-2 py-1 rounded-full ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
          {isCompleted ? 'Concluído' : 'Pendente'}
        </span>
      </div>
    );
  };

  const hasAnyResults = Object.values(state).some(result => result !== undefined);

  const renderColorSummary = (color: any, title: string, icon: string) => (
    <div className="bg-white/80 rounded-xl p-6 border border-[#947B62]/20 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-xl font-bold text-[#947B62]">{title}</h3>
      </div>
      <div className="flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
          style={{ backgroundColor: color.hex }}
          title={color.hex}
        ></div>
        <div className="flex-1">
          <div className="text-sm text-gray-600 space-y-1">
            <div><span className="font-medium">Hex:</span> {color.hex}</div>
            <div><span className="font-medium">Luminosidade:</span> {color.lightness.toFixed(1)}</div>
            <div><span className="font-medium">Saturação:</span> {color.chroma.toFixed(1)}</div>
            <div><span className="font-medium">Matiz:</span> {color.hue.toFixed(1)}°</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDimensionalAnalysis = () => {
    if (!finalResults?.dimensional_analysis) return null;

    const { chroma, contrast, lightness, temperature } = finalResults.dimensional_analysis;

    return (
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <h3 className="text-xl font-bold text-[#947B62] mb-4">🎨 Saturação (Chroma)</h3>
          <div className="space-y-2">
            <div className="text-lg font-semibold text-blue-700">{chroma.classification}</div>
            <div className="text-sm text-blue-600">Valor C: {chroma.C_value.toFixed(1)}</div>
            {chroma.approximate && (
              <div className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                ⚠️ Aproximação
              </div>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <h3 className="text-xl font-bold text-[#947B62] mb-4">🌡️ Temperatura</h3>
          <div className="space-y-2">
            <div className="text-lg font-semibold text-purple-700">{temperature.classification}</div>
            <div className="text-sm text-purple-600">Matiz: {temperature.hue.toFixed(1)}°</div>
            {temperature.approximate && (
              <div className="text-sm text-purple-600 bg-purple-100 px-2 py-1 rounded">
                ⚠️ Aproximação
              </div>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <h3 className="text-xl font-bold text-[#947B62] mb-4">💡 Luminosidade</h3>
          <div className="space-y-2">
            <div className="text-lg font-semibold text-green-700">{lightness.classification}</div>
            <div className="text-sm text-green-600">Valor L: {lightness.L_value.toFixed(1)}</div>
            {lightness.approximate && (
              <div className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
                ⚠️ Aproximação
              </div>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
          <h3 className="text-xl font-bold text-[#947B62] mb-4">⚡ Contraste</h3>
          <div className="space-y-2">
            <div className="text-lg font-semibold text-orange-700">{contrast.classification}</div>
            <div className="text-sm text-orange-600 space-y-1">
              <div>Pele L: {contrast.skin_L.toFixed(1)}</div>
              <div>Cabelo L: {contrast.hair_L.toFixed(1)}</div>
              <div>Delta L: {contrast.delta_l.toFixed(1)}</div>
            </div>
            {contrast.very_low && (
              <div className="text-sm text-orange-600 bg-orange-100 px-2 py-1 rounded">
                ⚠️ Contraste muito baixo
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSeasonalClassification = () => {
    if (!finalResults?.seasonal_classification) return null;

    const { primary_season, alternative_seasons, confidence_percentage, explanation } = finalResults.seasonal_classification;

    return (
      <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-8 border border-amber-200 shadow-lg">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-[#947B62] mb-2">🌸 Classificação Sazonal</h2>
          <div className="text-4xl font-bold text-amber-700 mb-2">{primary_season}</div>
          <div className="text-xl text-amber-600">Confiança: {confidence_percentage}%</div>
        </div>

        <div className="bg-white/60 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-[#947B62] mb-2">Explicação:</h3>
          <p className="text-gray-700">{explanation}</p>
        </div>

        {alternative_seasons.length > 0 && (
          <div className="bg-white/60 rounded-lg p-4">
            <h3 className="font-semibold text-[#947B62] mb-2">Alternativas:</h3>
            <div className="flex flex-wrap gap-2">
              {alternative_seasons.map((season, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-amber-200 text-amber-800 rounded-full text-sm font-medium"
                >
                  {season}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderResultsTab = () => {
    if (!finalResults) return null;

    return (
      <div className="space-y-8">
        {/* Seasonal Classification */}
        {renderSeasonalClassification()}

        {/* Color Summaries */}
        <div>
          <h2 className="text-2xl font-bold text-[#947B62] mb-6 text-center">🎨 Resumo das Cores</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {renderColorSummary(finalResults.color_summaries.skin, 'Pele', '👤')}
            {renderColorSummary(finalResults.color_summaries.hair, 'Cabelo', '💇‍♀️')}
            {renderColorSummary(finalResults.color_summaries.eye, 'Olhos', '👁️')}
          </div>
        </div>

        {/* Dimensional Analysis */}
        <div>
          <h2 className="text-2xl font-bold text-[#947B62] mb-6 text-center">📊 Análise Dimensional</h2>
          {renderDimensionalAnalysis()}
        </div>

        {/* Approximation Flags */}
        {finalResults.approximation_flags.length > 0 && (
          <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
            <h3 className="text-lg font-bold text-yellow-800 mb-3">⚠️ Observações</h3>
            <ul className="space-y-2">
              {finalResults.approximation_flags.map((flag, index) => (
                <li key={index} className="text-yellow-700 text-sm">
                  • {flag}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const handleStartAnalysis = async () => {
    const flattenPalettes = (result: Record<string, FeatureAnalysis>) => {
      const palettes: Record<string, { median: string; dark: string; average: string; light: string; result: string }> = {};
      for (const [key, value] of Object.entries(result)) {
        palettes[key] = {
          median: value.color_palette.median,
          dark: value.color_palette.dark,
          average: value.color_palette.average,
          light: value.color_palette.light,
          result: value.color_palette.result,
        };
      }
      return palettes;
    };

    const allPalettes = {
      ...(state.frenteSolto?.output?.result ? flattenPalettes(state.frenteSolto.output.result) : {}),
      ...(state.frentePreso?.output?.result ? flattenPalettes(state.frentePreso.output.result) : {}),
      ...(state.perfil?.output?.result ? flattenPalettes(state.perfil.output.result) : {}),
      ...(state.olhos?.output?.result ? flattenPalettes(state.olhos.output.result) : {}),
      ...(state.pulso?.output?.result ? flattenPalettes(state.pulso.output.result) : {}),
    };

    setIsAnalyzing(true);
    setAnalysisStatus('Iniciando análise...');

    try {
      console.log('Starting final analysis...');
      console.log('Sending palettes:', allPalettes);
      
      const result = await ColorAnalysisService.performFinalAnalysis(
        allPalettes,
        (status) => {
          console.log('Analysis status:', status);
          setAnalysisStatus(status);
        }
      );
      
      console.log('Final analysis result:', result);
      
      // Check if we have the expected structure
      if (result?.output?.results) {
        const { seasonal_classification, dimensional_analysis, color_summaries, approximation_flags } = result.output.results;
        
        console.log('Seasonal Classification:', seasonal_classification);
        console.log('Dimensional Analysis:', dimensional_analysis);
        console.log('Color Summaries:', color_summaries);
        
        setAnalysisStatus('Análise concluída!');
        
        // Store the results
        setFinalResults({
          seasonal_classification,
          dimensional_analysis,
          color_summaries,
          approximation_flags: approximation_flags || []
        });
        
        // Switch to results tab
        setActiveTab('results');
      } else {
        console.warn('Unexpected result structure:', result);
        setAnalysisStatus('Análise concluída com formato inesperado');
        alert('Análise concluída, mas o formato do resultado é inesperado. Verifique o console para mais detalhes.');
      }
    } catch (error) {
      console.error('Error during final analysis:', error);
      setAnalysisStatus('Erro na análise');
      alert(`Erro durante a análise: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsAnalyzing(false);
    }
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
          <>
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
              <div
                className="bg-[#947B62] h-4 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mb-6">{completedTests} de {totalTests} testes concluídos ({Math.round(progressPercentage)}%)</p>

            {/* Test States */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {renderTestState('frenteSolto', 'Foto de Frente – Solto')}
              {renderTestState('frentePreso', 'Foto de Frente – Preso')}
              {renderTestState('perfil', 'Foto de Perfil')}
              {renderTestState('olhos', 'Foto dos Olhos')}
              {renderTestState('pulso', 'Foto do Pulso')}
            </div>

            {completedTests === totalTests && (
              <div className="flex flex-col items-center w-full mb-6">
                <button
                  onClick={handleStartAnalysis}
                  disabled={isAnalyzing}
                  className="px-8 py-3 rounded-xl bg-[#947B62] text-white font-semibold hover:bg-[#7a624e] transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow focus:ring-4 focus:ring-[#947B62]/30 mb-4"
                >
                  {isAnalyzing ? <Loader statusText={analysisStatus || 'Analisando...'} /> : 'Começar Análise'}
                </button>

                {/* Results Overview Section */}
                <details className="w-full border border-[#947B62] rounded-lg mb-4">
                  <summary className="cursor-pointer text-[#947B62] font-medium p-2">Resumo Visual dos Resultados</summary>
                  <div className="mt-4 p-4 bg-white rounded-lg">
                    <div className="flex flex-col lg:flex-row gap-6 items-start">
                      {/* First Photo */}
                      <div className="flex-shrink-0">
                        {state.frenteSolto?.output?.image_url && (
                          <div>
                            <h3 className="text-lg font-semibold mb-2 text-[#947B62]">Imagem de Referência</h3>
                            <div className="relative w-64 h-auto overflow-hidden rounded-lg shadow-md">
                              {/* Current Image */}
                              <img 
                                src={currentImageSrc} 
                                alt="Imagem analisada" 
                                className="w-64 h-auto"
                              />
                              
                              {/* Loading Overlay */}
                              {isImageLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg z-20">
                                  <div className="flex flex-col items-center space-y-3">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-3 border-[#947B62]"></div>
                                    <div className="text-sm text-gray-700 font-medium">Carregando nova imagem...</div>
                                    <div className="w-16 bg-gray-200 rounded-full h-1">
                                      <div className="bg-[#947B62] h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Color Results */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-4 text-[#947B62]">Cores Extraídas</h3>
                        <div className="grid grid-cols-1 gap-3">
                          {state.frenteSolto && 'hair_root' in state.frenteSolto.output.result && (
                            <div 
                              className="space-y-3 p-3 bg-blue-50/50 rounded-lg border border-blue-200/50 transition-colors duration-200 hover:bg-blue-100/70"
                              onMouseEnter={() => handleImageHover('frenteSolto')}
                              onMouseLeave={() => handleImageHover(null)}
                            >
                              <div className="flex items-center gap-3 p-2 bg-white rounded-lg">
                                <div
                                  className="w-12 h-8 rounded border border-gray-300"
                                  style={{ backgroundColor: state.frenteSolto.output.result.hair_root.color_palette.result }}
                                  title={state.frenteSolto.output.result.hair_root.color_palette.result}
                                ></div>
                                <span className="font-medium text-gray-800">Raiz do cabelo</span>
                              </div>
                              <div className="flex items-center gap-3 p-2 bg-white rounded-lg">
                                <div
                                  className="w-12 h-8 rounded border border-gray-300"
                                  style={{ backgroundColor: state.frenteSolto.output.result.eyebrows.color_palette.result }}
                                  title={state.frenteSolto.output.result.eyebrows.color_palette.result}
                                ></div>
                                <span className="font-medium text-gray-800">Sobrancelhas</span>
                              </div>
                            </div>
                          )}
                          
                          {state.frentePreso && 'forehead' in state.frentePreso.output.result && (
                            <div 
                              className="space-y-3 p-3 bg-green-50/50 rounded-lg border border-green-200/50 transition-colors duration-200 hover:bg-green-100/70"
                              onMouseEnter={() => handleImageHover('frentePreso')}
                              onMouseLeave={() => handleImageHover(null)}
                            >
                              <div className="flex items-center gap-3 p-2 bg-white rounded-lg">
                                <div
                                  className="w-12 h-8 rounded border border-gray-300"
                                  style={{ backgroundColor: state.frentePreso.output.result.forehead.color_palette.result }}
                                  title={state.frentePreso.output.result.forehead.color_palette.result}
                                ></div>
                                <span className="font-medium text-gray-800">Testa</span>
                              </div>
                              <div className="flex items-center gap-3 p-2 bg-white rounded-lg">
                                <div
                                  className="w-12 h-8 rounded border border-gray-300"
                                  style={{ backgroundColor: state.frentePreso.output.result.around_mouth.color_palette.result }}
                                  title={state.frentePreso.output.result.around_mouth.color_palette.result}
                                ></div>
                                <span className="font-medium text-gray-800">Região da boca</span>
                              </div>
                              <div className="flex items-center gap-3 p-2 bg-white rounded-lg">
                                <div
                                  className="w-12 h-8 rounded border border-gray-300"
                                  style={{ backgroundColor: state.frentePreso.output.result.mouth.color_palette.result }}
                                  title={state.frentePreso.output.result.mouth.color_palette.result}
                                ></div>
                                <span className="font-medium text-gray-800">Boca</span>
                              </div>
                            </div>
                          )}

                          {state.olhos && 'iris' in state.olhos.output.result && (
                            <div 
                              className="space-y-3 p-3 bg-yellow-50/50 rounded-lg border border-yellow-200/50 transition-colors duration-200 hover:bg-yellow-100/70"
                              onMouseEnter={() => handleImageHover('olhos')}
                              onMouseLeave={() => handleImageHover(null)}
                            >
                              <div className="flex items-center gap-3 p-2 bg-white rounded-lg">
                                <div
                                  className="w-12 h-8 rounded border border-gray-300"
                                  style={{ backgroundColor: state.olhos.output.result.under_eye_skin.color_palette.result }}
                                  title={state.olhos.output.result.under_eye_skin.color_palette.result}
                                ></div>
                                <span className="font-medium text-gray-800">Pele abaixo dos olhos</span>
                              </div>
                              <div className="flex items-center gap-3 p-2 bg-white rounded-lg">
                                <div
                                  className="w-12 h-8 rounded border border-gray-300"
                                  style={{ backgroundColor: state.olhos.output.result.iris.color_palette.result }}
                                  title={state.olhos.output.result.iris.color_palette.result}
                                ></div>
                                <span className="font-medium text-gray-800">Íris</span>
                              </div>
                            </div>
                          )}

                          {state.perfil && 'cheek' in state.perfil.output.result && (
                            <div 
                              className="space-y-3 p-3 bg-purple-50/50 rounded-lg border border-purple-200/50 transition-colors duration-200 hover:bg-purple-100/70"
                              onMouseEnter={() => handleImageHover('perfil')}
                              onMouseLeave={() => handleImageHover(null)}
                            >
                              <div className="flex items-center gap-3 p-2 bg-white rounded-lg">
                                <div
                                  className="w-12 h-8 rounded border border-gray-300"
                                  style={{ backgroundColor: state.perfil.output.result.cheek.color_palette.result }}
                                  title={state.perfil.output.result.cheek.color_palette.result}
                                ></div>
                                <span className="font-medium text-gray-800">Bochecha</span>
                              </div>
                            </div>
                          )}
                          
                          {state.pulso && 'pulse' in state.pulso.output.result && (
                            <div 
                              className="space-y-3 p-3 bg-pink-50/50 rounded-lg border border-pink-200/50 transition-colors duration-200 hover:bg-pink-100/70"
                              onMouseEnter={() => handleImageHover('pulso')}
                              onMouseLeave={() => handleImageHover(null)}
                            >
                              <div className="flex items-center gap-3 p-2 bg-white rounded-lg">
                                <div
                                  className="w-12 h-8 rounded border border-gray-300"
                                  style={{ backgroundColor: state.pulso.output.result.pulse.color_palette.result }}
                                  title={state.pulso.output.result.pulse.color_palette.result}
                                ></div>
                                <span className="font-medium text-gray-800">Pulso</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </details>

                {/* Logs Section */}
                <details className="w-full border border-[#947B62] rounded-lg">
                  <summary className="cursor-pointer text-[#947B62] font-medium p-2">Logs</summary>
                  <div className="mt-4 p-4 bg-white rounded-lg">
                    <p className="text-sm text-gray-600 mb-4">Aqui você pode visualizar os resultados extraídos de cada teste concluído.</p>
                    <div className="w-full grid md:grid-cols-2 gap-8">
                      {/* Frente Solto Results */}
                      {state.frenteSolto && (
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                          <h2 className="text-2xl font-bold mb-4 text-[#947B62]">Foto de Frente – Solto</h2>
                          {'hair_root' in state.frenteSolto.output.result && (
                            <>
                              {renderColorPalette(state.frenteSolto.output.result.hair_root, 'Raiz do Cabelo')}
                              {renderColorPalette(state.frenteSolto.output.result.eyebrows, 'Sobrancelhas')}
                            </>
                          )}
                        </div>
                      )}

                      {/* Frente Preso Results */}
                      {state.frentePreso && (
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                          <h2 className="text-2xl font-bold mb-4 text-[#947B62]">Foto de Frente – Preso</h2>
                          {'forehead' in state.frentePreso.output.result && (
                            <>
                              {renderColorPalette(state.frentePreso.output.result.forehead, 'Testa')}
                              {renderColorPalette(state.frentePreso.output.result.around_mouth, 'Região da Boca')}
                              {renderColorPalette(state.frentePreso.output.result.mouth, 'Boca')}
                            </>
                          )}
                        </div>
                      )}

                      {/* Perfil Results */}
                      {state.perfil && (
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                          <h2 className="text-2xl font-bold mb-4 text-[#947B62]">Foto de Perfil</h2>
                          {'cheek' in state.perfil.output.result && (
                            <>
                              {renderColorPalette(state.perfil.output.result.cheek, 'Bochecha')}
                            </>
                          )}
                        </div>
                      )}

                      {/* Olhos Results */}
                      {state.olhos && (
                        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200">
                          <h2 className="text-2xl font-bold mb-4 text-[#947B62]">Foto dos Olhos</h2>
                          {'iris' in state.olhos.output.result && (
                            <>
                              {renderColorPalette(state.olhos.output.result.under_eye_skin, 'Pele abaixo dos olhos')}
                              {renderColorPalette(state.olhos.output.result.iris, 'Íris')}
                            </>
                          )}
                        </div>
                      )}

                      {/* Pulso Results */}
                      {state.pulso && (
                        <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-xl border border-pink-200">
                          <h2 className="text-2xl font-bold mb-4 text-[#947B62]">Foto do Pulso</h2>
                          {'pulse' in state.pulso.output.result && (
                            <>
                              {renderColorPalette(state.pulso.output.result.pulse, 'Pulso')}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </details>
              </div>
            )}
          </>
        ) : (
          /* Results Tab Content */
          <div className="w-full text-left">
            {renderResultsTab()}
            
            {/* Try Again Button */}
            <div className="flex justify-center mt-8">
              <button
                onClick={() => {
                  setFinalResults(null);
                  setActiveTab('extractions');
                  setAnalysisStatus('');
                }}
                className="mt-6 px-8 py-3 rounded-xl bg-gray-600 text-white font-semibold hover:bg-gray-700 transition-colors shadow focus:ring-4"
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        )}
      </div>
      <AnimationsStyles />
    </div>
  );
};

export default ColoracaoResults;
