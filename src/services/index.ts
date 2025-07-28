// Export all services for easy importing
export { ApiClient } from './apiClient';
export { ColorAnalysisService } from './colorAnalysisService';
export { BackgroundRemovalService } from './backgroundRemovalService';
export { StyleAnalysisService } from './styleAnalysisService';
export { ApiDebugger } from './apiDebugger';

// Export configuration
export { API_CONFIG, validateApiConfiguration, getApiUrl } from './apiConfig';

// Re-export types for convenience
export type {
  ApiResponse,
  PollableResponse,
  PollStatus,
} from './apiClient';

export type {
  ColorAnalysisRequest,
  FinalAnalysisRequest,
} from './colorAnalysisService';

export type {
  RemoveBackgroundRequest,
  RemoveBackgroundResult,
} from './backgroundRemovalService';

export type {
  StyleAnalysisResult,
  PhotoAnalysisResult,
} from './styleAnalysisService';

export type {
  ApiConfig,
  ApiEndpoint,
} from './apiConfig';
