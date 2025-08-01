export interface FeatureAnalysis {
  color_palette: {
    average: string;
    dark: string;
    light: string;
    median: string;
    result: string;
  };
  region: number[][];
  uploaded_images: {
    cropped_url: string;
    filtered_url: string;
    palette_url: string;
  };
}

export interface FrenteSoltoResult {
  output: {
    image_url: string;
    result: {
      eyebrows: FeatureAnalysis;
      hair_root: FeatureAnalysis;
    };
  };
}

export interface FrentePresoResult {
  output: {
    image_url: string;
    result: {
      forehead: FeatureAnalysis;
      mouth: FeatureAnalysis;
      below_mouth: FeatureAnalysis;
      chin: FeatureAnalysis;
    };
  };
}

export interface PerfilResult {
  output: {
    image_url: string;
    result: {
      cheek: FeatureAnalysis;
    };
  };
}

export interface OlhosResult {
  output: {
    image_url: string;
    result: {
      under_eye_skin: FeatureAnalysis;
      iris: FeatureAnalysis;
    };
  };
}

export interface PulsoResult {
  output: {
    image_url: string;
    result: {
      pulse: FeatureAnalysis;
    };
  };
}

export type ColorAnalysisResult = FrenteSoltoResult | FrentePresoResult | PerfilResult | OlhosResult | PulsoResult;

export interface StepFormState {
  imageUrl: string;
  loading: boolean;
  error: string | null;
  statusText: string | null;
  isImageValid: boolean;
}

export interface ColoracaoState {
  frenteSolto?: FrenteSoltoResult;
  frentePreso?: FrentePresoResult;
  perfil?: PerfilResult;
  olhos?: OlhosResult;
  pulso?: PulsoResult;
}

export interface ColoracaoFormState {
  frenteSolto?: StepFormState;
  frentePreso?: StepFormState;
  perfil?: StepFormState;
  olhos?: StepFormState;
  pulso?: StepFormState;
}

export interface StepConfig {
  type: 'frente_solto' | 'frente_preso' | 'perfil' | 'olho' | 'pulso';
  title: string;
  description: string;
  imageUrls: string[];
  stateKey: keyof ColoracaoState;
}
