import { ApiClient, PollableResponse } from './apiClient';
import { API_CONFIG } from './apiConfig';

export interface RemoveBackgroundRequest {
  url: string;
}

export interface RemoveBackgroundResult {
  image: string; // Object URL of the processed image
}

export class BackgroundRemovalService {
  /**
   * Submit an image URL for background removal
   */
  static async submitBackgroundRemoval(
    request: RemoveBackgroundRequest,
    signal?: AbortSignal
  ): Promise<PollableResponse> {
    return ApiClient.post<PollableResponse>(
      'VITE_REMOVE_BACKGROUND_URL',
      request,
      signal
    );
  }

  /**
   * Poll for background removal result
   */
  static async pollBackgroundRemovalResult(
    id: string,
    controller: AbortController,
    onStatusUpdate?: (status: string) => void
  ): Promise<RemoveBackgroundResult> {
    return ApiClient.pollForResult<RemoveBackgroundResult>(
      'VITE_REMOVE_BACKGROUND_POLL_URL',
      id,
      controller,
      onStatusUpdate
    );
  }

  /**
   * Complete workflow: submit image and poll for result
   */
  static async removeBackground(
    request: RemoveBackgroundRequest,
    onStatusUpdate?: (status: string) => void
  ): Promise<RemoveBackgroundResult> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeouts.default);

    try {
      // Step 1: Submit for background removal
      const { id } = await this.submitBackgroundRemoval(request, controller.signal);
      
      // Step 2: Poll for result
      const result = await this.pollBackgroundRemovalResult(id, controller, onStatusUpdate);
      
      return result;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
