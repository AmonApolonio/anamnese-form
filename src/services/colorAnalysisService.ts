import { ApiClient, PollableResponse } from './apiClient';
import { ColorAnalysisResult } from '../types/coloracao';
import { API_CONFIG } from './apiConfig';

export interface ColorAnalysisRequest {
  url: string;
  type: 'frente_solto' | 'frente_preso' | 'perfil' | 'olho' | 'pulso';
}

export interface FinalAnalysisRequest {
  [key: string]: {
    median: string;
    dark: string;
    average: string;
    light: string;
    result: string;
  };
}

export class ColorAnalysisService {
  /**
   * Submit an image for color analysis
   */
  static async submitAnalysis(
    request: ColorAnalysisRequest,
    signal?: AbortSignal
  ): Promise<PollableResponse> {
    return ApiClient.post<PollableResponse>(
      'VITE_COLOR_ANALYSIS_URL',
      request,
      signal
    );
  }

  /**
   * Poll for color analysis result
   */
  static async pollAnalysisResult(
    id: string,
    controller: AbortController,
    onStatusUpdate?: (status: string) => void
  ): Promise<ColorAnalysisResult> {
    return ApiClient.pollForResult<ColorAnalysisResult>(
      'VITE_COLOR_ANALYSIS_POLL_URL',
      id,
      controller,
      onStatusUpdate
    );
  }

  /**
   * Submit final analysis with all color palettes
   */
  static async submitFinalAnalysis(
    palettes: FinalAnalysisRequest,
    signal?: AbortSignal
  ): Promise<PollableResponse> {
    return ApiClient.post<PollableResponse>(
      'VITE_COLOR_ANALYSIS_FINAL_URL',
      palettes,
      signal
    );
  }

  /**
   * Poll for final analysis result
   */
  static async pollFinalAnalysisResult(
    id: string,
    controller: AbortController,
    onStatusUpdate?: (status: string) => void
  ): Promise<any> {
    return ApiClient.pollForResult(
      'VITE_COLOR_ANALYSIS_POLL_URL',
      id,
      controller,
      onStatusUpdate
    );
  }

  /**
   * Complete workflow: submit analysis and poll for result
   */
  static async analyzeImage(
    request: ColorAnalysisRequest,
    onStatusUpdate?: (status: string) => void
  ): Promise<ColorAnalysisResult> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeouts.default);

    try {
      // Step 1: Submit for analysis
      const { id } = await this.submitAnalysis(request, controller.signal);
      
      // Step 2: Poll for result
      const result = await this.pollAnalysisResult(id, controller, onStatusUpdate);
      
      return result;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Complete final analysis workflow
   */
  static async performFinalAnalysis(
    palettes: FinalAnalysisRequest,
    onStatusUpdate?: (status: string) => void
  ): Promise<any> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeouts.default);

    try {
      // Step 1: Submit final analysis
      const { id } = await this.submitFinalAnalysis(palettes, controller.signal);
      
      // Step 2: Poll for result
      const result = await this.pollFinalAnalysisResult(id, controller, onStatusUpdate);
      
      return result;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
