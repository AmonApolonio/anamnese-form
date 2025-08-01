import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackToMenuButton from '../shared/BackToMenuButton';
import AnimationsStyles from '../shared/AnimationsStyles';
import Loader from '../quiz/Loader';
import { useColoracao } from '../../contexts/ColoracaoContext';
import { FeatureAnalysis } from '../../types/coloracao';
import { ColorAnalysisService } from '../../services';

interface ParameterMatch {
  match: 'primary' | 'secondary' | 'none';
  expected: string;
  primary: string;
  secondary: string;
}

interface SeasonData {
  score: number;
  contraste: ParameterMatch;
  temperatura: ParameterMatch;
  profundidade: ParameterMatch;
  intensidade: ParameterMatch;
}

interface TopCandidate {
  season: string;
  confidence: number;
  match_score: number;
  exact_match: boolean;
  used_primary: string[];
  used_secondary: string[];
}

interface FinalAnalysisResult {
  seasonal_classification: {
    season: string;
    confidence: number;
    explanation: string;
    top_candidates: TopCandidate[];
    decision_table: {
      seasons: Record<string, SeasonData>;
      season_scores: Record<string, number>;
    };
  };
  dimensional_analysis: {
    contraste: {
      primaryClassification: string;
      secondClassification: string;
      skin_L: number;
      hair_L: number;
      eye_L: number;
      delta_l: number;
    };
    temperatura: {
      primaryClassification: string;
      secondClassification: string;
      hue: number;
      approximate: boolean;
      skin_temperatura: string;
      hair_temperatura: string;
      eye_temperatura: string;
      skin_hue: number;
      hair_hue: number;
      eye_hue: number;
    };
    profundidade: {
      primaryClassification: string;
      secondClassification: string;
      approximate: boolean;
      skin_reference_l: number;
      under_eye_l: number;
      below_mouth_l: number;
      delta_under_eye: number;
      delta_below_mouth: number;
      under_eye_classification: string;
      below_mouth_classification: string;
    };
    intensidade: {
      primaryClassification: string;
      secondClassification: string;
      C_value: number;
      approximate: boolean;
      skin_intensidade: string;
      skin_c_value: number;
      hair_intensidade: string;
      hair_c_value: number;
      eye_intensidade: string;
      eye_c_value: number;
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
  const [imageOpacity, setImageOpacity] = useState<number>(1);
  const [tooltipData, setTooltipData] = useState<{
    visible: boolean;
    x: number;
    y: number;
    content: ParameterMatch | null;
    parameter: string;
  }>({
    visible: false,
    x: 0,
    y: 0,
    content: null,
    parameter: ''
  });

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
          // Image is ready, fade out current image then change
          setImageOpacity(0);
          setTimeout(() => {
            setCurrentImageSrc(newImageUrl);
            setImageOpacity(1);
          }, 150); // Half of the transition duration
        } else {
          // Image not preloaded, show loading state with fade
          setImageOpacity(0);
          setIsImageLoading(true);
          
          // Preload the specific image
          const img = new Image();
          img.onload = () => {
            setPreloadedImages(prev => ({ ...prev, [newImageUrl]: true }));
            setTimeout(() => {
              setCurrentImageSrc(newImageUrl);
              setIsImageLoading(false);
              setImageOpacity(1);
            }, 150);
          };
          img.onerror = () => {
            console.warn(`Failed to load image: ${newImageUrl}`);
            setIsImageLoading(false);
            setImageOpacity(1);
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

  const renderDimensionalAnalysis = () => {
    if (!finalResults?.dimensional_analysis) return null;

    const { contraste, temperatura, profundidade, intensidade } = finalResults.dimensional_analysis;

    return (
      <div className="grid md:grid-cols-2 gap-6">
        {/* contraste Analysis */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
          <h3 className="text-xl font-bold text-[#947B62] mb-4">⚡ Contraste</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="text-lg font-semibold text-orange-700 bg-orange-200 px-3 py-1 rounded-lg">
                {contraste.primaryClassification}
              </div>
              <div className="text-sm font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded">
                {contraste.secondClassification}
              </div>
            </div>
            <div className="text-sm text-orange-600 space-y-1">
              <div><span className="font-medium">Pele L:</span> {contraste.skin_L.toFixed(1)}</div>
              <div><span className="font-medium">Cabelo L:</span> {contraste.hair_L.toFixed(1)}</div>
              <div><span className="font-medium">Olhos L:</span> {contraste.eye_L.toFixed(1)}</div>
              <div><span className="font-medium">Delta L:</span> {contraste.delta_l.toFixed(1)}</div>
            </div>
          </div>
        </div>

        {/* temperatura Analysis */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <h3 className="text-xl font-bold text-[#947B62] mb-4">🌡️ Temperatura</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="text-lg font-semibold text-purple-700 bg-purple-200 px-3 py-1 rounded-lg">
                {temperatura.primaryClassification}
              </div>
              <div className="text-sm font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded">
                {temperatura.secondClassification}
              </div>
            </div>
            <div className="text-sm text-purple-600 space-y-1">
              <div><span className="font-medium">Matiz Geral:</span> {temperatura.hue.toFixed(1)}°</div>
              <div><span className="font-medium">Pele:</span> {temperatura.skin_temperatura} ({temperatura.skin_hue.toFixed(1)}°)</div>
              <div><span className="font-medium">Cabelo:</span> {temperatura.hair_temperatura} ({temperatura.hair_hue.toFixed(1)}°)</div>
              <div><span className="font-medium">Olhos:</span> {temperatura.eye_temperatura} ({temperatura.eye_hue.toFixed(1)}°)</div>
            </div>
            {temperatura.approximate && (
              <div className="text-sm text-purple-600 bg-purple-100 px-2 py-1 rounded">
                ⚠️ Aproximação
              </div>
            )}
          </div>
        </div>

        {/* profundidade Analysis */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <h3 className="text-xl font-bold text-[#947B62] mb-4">🌊 Profundidade</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="text-lg font-semibold text-green-700 bg-green-200 px-3 py-1 rounded-lg">
                {profundidade.primaryClassification}
              </div>
              <div className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                {profundidade.secondClassification}
              </div>
            </div>
            <div className="text-sm text-green-600 space-y-1">
              <div><span className="font-medium">Pele (Ref):</span> {profundidade.skin_reference_l.toFixed(1)}</div>
              <div><span className="font-medium">Abaixo dos olhos:</span> {profundidade.under_eye_l.toFixed(1)} ({profundidade.under_eye_classification})</div>
              <div><span className="font-medium">Abaixo da boca:</span> {profundidade.below_mouth_l.toFixed(1)} ({profundidade.below_mouth_classification})</div>
              <div><span className="font-medium">Delta abaixo dos olhos:</span> {profundidade.delta_under_eye.toFixed(1)}</div>
              <div><span className="font-medium">Delta abaixo da boca:</span> {profundidade.delta_below_mouth.toFixed(1)}</div>
            </div>
            {profundidade.approximate && (
              <div className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
                ⚠️ Aproximação
              </div>
            )}
          </div>
        </div>

        {/* intensidade Analysis */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <h3 className="text-xl font-bold text-[#947B62] mb-4">🎨 Intensidade</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="text-lg font-semibold text-blue-700 bg-blue-200 px-3 py-1 rounded-lg">
                {intensidade.primaryClassification}
              </div>
              <div className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                {intensidade.secondClassification}
              </div>
            </div>
            <div className="text-sm text-blue-600 space-y-1">
              <div><span className="font-medium">Valor C Geral:</span> {intensidade.C_value.toFixed(1)}</div>
              <div><span className="font-medium">Pele:</span> {intensidade.skin_intensidade} ({intensidade.skin_c_value.toFixed(1)})</div>
              <div><span className="font-medium">Cabelo:</span> {intensidade.hair_intensidade} ({intensidade.hair_c_value.toFixed(1)})</div>
              <div><span className="font-medium">Olhos:</span> {intensidade.eye_intensidade} ({intensidade.eye_c_value.toFixed(1)})</div>
            </div>
            {intensidade.approximate && (
              <div className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                ⚠️ Aproximação
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const getMatchColor = (match: 'primary' | 'secondary' | 'none') => {
    switch (match) {
      case 'primary':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'secondary':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'none':
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getMatchText = (match: 'primary' | 'secondary' | 'none') => {
    switch (match) {
      case 'primary':
        return 'Primário ✓';
      case 'secondary':
        return 'Secundário ~';
      case 'none':
        return 'Não ✗';
    }
  };

  const handleCellMouseEnter = (
    event: React.MouseEvent,
    paramData: ParameterMatch,
    parameter: string
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipData({
      visible: true,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      content: paramData,
      parameter: parameter
    });
  };

  const handleCellMouseLeave = () => {
    setTooltipData(prev => ({ ...prev, visible: false }));
  };

  const renderTooltip = () => {
    if (!tooltipData.visible || !tooltipData.content) return null;

    const { content, parameter } = tooltipData;
    
    return (
      <div
        className="fixed z-50 pointer-events-none"
        style={{
          left: tooltipData.x,
          top: tooltipData.y,
          transform: 'translateX(-50%) translateY(-100%)'
        }}
      >
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-xs">
          {/* Arrow */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
            <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
          </div>
          
          {/* Header */}
          <div className="mb-3 pb-2 border-b border-gray-100">
            <h4 className="font-semibold text-gray-800 capitalize text-sm">
              {parameter}
            </h4>
          </div>
          
          {/* Content */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">Esperado:</span>
              <span className="font-semibold text-gray-800 bg-gray-50 px-2 py-1 rounded">
                {content.expected}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">Primário:</span>
              <span className="font-semibold text-green-700 bg-green-50 px-2 py-1 rounded">
                {content.primary}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">Secundário:</span>
              <span className="font-semibold text-yellow-700 bg-yellow-50 px-2 py-1 rounded">
                {content.secondary}
              </span>
            </div>
            
            {/* Match Status */}
            <div className="mt-3 pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">Status:</span>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  content.match === 'primary' 
                    ? 'bg-green-100 text-green-700' 
                    : content.match === 'secondary'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {content.match === 'primary' && '✓ Match Primário'}
                  {content.match === 'secondary' && '~ Match Secundário'}
                  {content.match === 'none' && '✗ Não Corresponde'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDecisionTable = () => {
    if (!finalResults?.seasonal_classification?.decision_table) return null;

    const { seasons } = finalResults.seasonal_classification.decision_table;
    const parameters = ['contraste', 'temperatura', 'profundidade', 'intensidade'] as const;
    
    // Get top candidates season names for highlighting
    const topCandidateNames = finalResults.seasonal_classification.top_candidates.map(candidate => candidate.season);
    
    // Sort seasons by score (highest first)
    const sortedSeasons = Object.entries(seasons).sort((a, b) => b[1].score - a[1].score);

    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg overflow-x-auto">
        <h3 className="text-xl font-bold text-[#947B62] mb-4 text-center">📊 Tabela de Decisão Sazonal</h3>
        
        <div className="min-w-full">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-3 bg-[#947B62] text-white font-semibold text-left">
                  Estação
                </th>
                <th className="border border-gray-300 px-4 py-3 bg-[#947B62] text-white font-semibold text-center">
                  Score
                </th>
                {parameters.map((param) => (
                  <th key={param} className="border border-gray-300 px-4 py-3 bg-[#947B62] text-white font-semibold text-center capitalize">
                    {param}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedSeasons.map(([seasonName, seasonData], index) => {
                const isTopCandidate = topCandidateNames.includes(seasonName);
                return (
                  <tr key={seasonName} className={isTopCandidate ? 'bg-amber-50' : 'hover:bg-gray-50'}>
                    <td className="border border-gray-300 px-4 py-3 font-medium">
                      <div className="flex items-center gap-2">
                        {isTopCandidate && <span className="text-amber-500">👑</span>}
                        {seasonName}
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center font-semibold">
                      {seasonData.score}
                    </td>
                    {parameters.map((param) => {
                      const paramData = seasonData[param];
                      return (
                        <td key={param} className="border border-gray-300 px-2 py-3 text-center">
                          <div
                            className={`px-3 py-2 rounded-lg border text-sm font-medium cursor-help transition-all duration-200 hover:scale-105 hover:shadow-md ${getMatchColor(paramData.match)}`}
                            onMouseEnter={(e) => handleCellMouseEnter(e, paramData, param)}
                            onMouseLeave={handleCellMouseLeave}
                          >
                            {getMatchText(paramData.match)}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
            <span>Primário (5 pontos)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded"></div>
            <span>Secundário (1 ponto)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
            <span>Não corresponde (0 pontos)</span>
          </div>
        </div>
      </div>
    );
  };

  const renderTopCandidates = () => {
    if (!finalResults?.seasonal_classification?.top_candidates) return null;

    const topCandidates = finalResults.seasonal_classification.top_candidates.slice(0, 3);

    return (
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
        <h3 className="text-xl font-bold text-[#947B62] mb-4">🏆 Top Candidatos</h3>
        <div className="space-y-3">
          {topCandidates.map((candidate, index) => (
            <div key={candidate.season} className="bg-white/70 rounded-lg p-4 border border-blue-200/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </span>
                  <span className="font-semibold text-lg">{candidate.season}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Confiança</div>
                  <div className="font-bold text-blue-700">{candidate.confidence.toFixed(1)}%</div>
                </div>
              </div>
              <div className="text-sm text-gray-700 space-y-1">
                <div><span className="font-medium">Score:</span> {candidate.match_score}</div>
                <div><span className="font-medium">Match exato:</span> {candidate.exact_match ? 'Sim' : 'Não'}</div>
                {candidate.used_primary.length > 0 && (
                  <div>
                    <span className="font-medium">Usou primário em:</span> {candidate.used_primary.join(', ')}
                  </div>
                )}
                {candidate.used_secondary.length > 0 && (
                  <div>
                    <span className="font-medium">Usou secundário em:</span> {candidate.used_secondary.join(', ')}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSeasonalClassification = () => {
    if (!finalResults?.seasonal_classification) return null;

    const { season, confidence, explanation } = finalResults.seasonal_classification;

    return (
      <div className="space-y-6">
        {/* Main Result */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-8 border border-amber-200 shadow-lg">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-[#947B62] mb-2">🌸 Classificação Sazonal</h2>
            <div className="text-4xl font-bold text-amber-700 mb-2">{season}</div>
            <div className="text-xl text-amber-600">Confiança: {confidence.toFixed(1)}%</div>
          </div>

          <div className="bg-white/60 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-[#947B62] mb-2">Explicação:</h3>
            <p className="text-gray-700">{explanation}</p>
          </div>
        </div>

        {/* Decision Table */}
        {renderDecisionTable()}

        {/* Top Candidates */}
        {renderTopCandidates()}
      </div>
    );
  };

  const renderResultsTab = () => {
    if (!finalResults) return null;

    return (
      <div className="space-y-8">
        {/* Seasonal Classification */}
        {renderSeasonalClassification()}

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
        const { seasonal_classification, dimensional_analysis, approximation_flags } = result.output.results;
        
        console.log('Seasonal Classification:', seasonal_classification);
        console.log('Dimensional Analysis:', dimensional_analysis);
        
        setAnalysisStatus('Análise concluída!');
        
        // Store the results with the new structure
        setFinalResults({
          seasonal_classification: result.output.results.seasonal_classification,
          dimensional_analysis: result.output.results.dimensional_analysis,
          approximation_flags: result.output.results.approximation_flags || []
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
                                className="w-64 h-auto transition-opacity duration-300 ease-in-out"
                                style={{ opacity: imageOpacity }}
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
                                  style={{ backgroundColor: state.frentePreso.output.result.below_mouth.color_palette.result }}
                                  title={state.frentePreso.output.result.below_mouth.color_palette.result}
                                ></div>
                                <span className="font-medium text-gray-800">Abaixo da boca</span>
                              </div>
                              <div className="flex items-center gap-3 p-2 bg-white rounded-lg">
                                <div
                                  className="w-12 h-8 rounded border border-gray-300"
                                  style={{ backgroundColor: state.frentePreso.output.result.mouth.color_palette.result }}
                                  title={state.frentePreso.output.result.mouth.color_palette.result}
                                ></div>
                                <span className="font-medium text-gray-800">Boca</span>
                              </div>
                              <div className="flex items-center gap-3 p-2 bg-white rounded-lg">
                                <div
                                  className="w-12 h-8 rounded border border-gray-300"
                                  style={{ backgroundColor: state.frentePreso.output.result.chin.color_palette.result }}
                                  title={state.frentePreso.output.result.chin.color_palette.result}
                                ></div>
                                <span className="font-medium text-gray-800">Queixo</span>
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
                              {renderColorPalette(state.frentePreso.output.result.mouth, 'Boca')}
                              {renderColorPalette(state.frentePreso.output.result.below_mouth, 'Abaixo da Boca')}
                              {renderColorPalette(state.frentePreso.output.result.chin, 'Queixo')}
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
      
      {/* Custom Tooltip */}
      {renderTooltip()}
      
      <AnimationsStyles />
    </div>
  );
};

export default ColoracaoResults;
