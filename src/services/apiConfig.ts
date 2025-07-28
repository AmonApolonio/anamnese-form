/**
 * API Configuration
 * 
 * This file centralizes all API endpoint configurations.
 * It can be used to easily switch between different environments
 * or to add additional configuration like timeouts, retry policies, etc.
 */

import EnvConfig from '../config/envConfig';

export interface ApiEndpoint {
  key: string;
  description: string;
  required: boolean;
}

export interface ApiConfig {
  endpoints: {
    colorAnalysis: {
      submit: ApiEndpoint;
      poll: ApiEndpoint;
      final: ApiEndpoint;
    };
    backgroundRemoval: {
      submit: ApiEndpoint;
      poll: ApiEndpoint;
    };
    styleAnalysis: {
      upload: ApiEndpoint;
    };
  };
  timeouts: {
    default: number;
    polling: number;
  };
  polling: {
    maxAttempts: number;
    initialDelay: number;
    maxDelay: number;
    delayIncrement: number;
  };
}

export const API_CONFIG: ApiConfig = {
  endpoints: {
    colorAnalysis: {
      submit: {
        key: 'VITE_COLOR_ANALYSIS_URL',
        description: 'Submit image for color analysis',
        required: true,
      },
      poll: {
        key: 'VITE_COLOR_ANALYSIS_POLL_URL',
        description: 'Poll for color analysis results',
        required: true,
      },
      final: {
        key: 'VITE_COLOR_ANALYSIS_FINAL_URL',
        description: 'Submit final color analysis with all palettes',
        required: true,
      },
    },
    backgroundRemoval: {
      submit: {
        key: 'VITE_REMOVE_BACKGROUND_URL',
        description: 'Submit image for background removal',
        required: true,
      },
      poll: {
        key: 'VITE_REMOVE_BACKGROUND_POLL_URL',
        description: 'Poll for background removal results',
        required: true,
      },
    },
    styleAnalysis: {
      upload: {
        key: 'VITE_STYLE_ANALYSIS_URL',
        description: 'Upload photos for style analysis',
        required: true,
      },
    },
  },
  timeouts: {
    default: 180000, // 3 minutes
    polling: 300000, // 5 minutes for polling operations
  },
  polling: {
    maxAttempts: 60,
    initialDelay: 5000, // 5 seconds
    maxDelay: 15000, // 15 seconds
    delayIncrement: 5000, // Increase by 5 seconds after 6 attempts
  },
};

/**
 * Validates that all required environment variables are set
 */
export function validateApiConfiguration(): { valid: boolean; missingEndpoints: string[] } {
  const missingEndpoints: string[] = [];
  
  const checkEndpoint = (endpoint: ApiEndpoint) => {
    if (endpoint.required && !EnvConfig.getEnvVariable(endpoint.key)) {
      missingEndpoints.push(`${endpoint.key} - ${endpoint.description}`);
    }
  };

  // Check color analysis endpoints
  checkEndpoint(API_CONFIG.endpoints.colorAnalysis.submit);
  checkEndpoint(API_CONFIG.endpoints.colorAnalysis.poll);
  checkEndpoint(API_CONFIG.endpoints.colorAnalysis.final);

  // Check background removal endpoints
  checkEndpoint(API_CONFIG.endpoints.backgroundRemoval.submit);
  checkEndpoint(API_CONFIG.endpoints.backgroundRemoval.poll);

  // Check style analysis endpoints
  checkEndpoint(API_CONFIG.endpoints.styleAnalysis.upload);

  return {
    valid: missingEndpoints.length === 0,
    missingEndpoints,
  };
}

/**
 * Gets an API URL from environment variables with validation
 */
export function getApiUrl(endpointKey: string): string {
  const url = EnvConfig.getEnvVariable(endpointKey);
  if (!url) {
    throw new Error(`API endpoint ${endpointKey} is not configured`);
  }
  return url;
}
