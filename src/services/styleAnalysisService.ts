import { getApiUrl } from './apiConfig';

export interface StyleAnalysisResult {
  estilo: string;
  tags: string[];
}

export interface PhotoAnalysisResult {
  file: File;
  result: string;
  tags?: string[];
}

export class StyleAnalysisService {
  /**
   * Upload and analyze multiple photos for style analysis
   */
  static async analyzePhotos(files: File[]): Promise<PhotoAnalysisResult[]> {
    const N8N_POST_URL = getApiUrl('VITE_STYLE_ANALYSIS_URL');

    const uploadPromises = files.map(async (file, idx) => {
      const formData = new FormData();
      formData.append('data', file);

      const response = await fetch(N8N_POST_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erro ao enviar foto ${idx + 1}`);
      }

      const data = await response.json();
      
      // Handle different response formats
      let estilo = '';
      let tags: string[] = [];

      if (Array.isArray(data) && data[0]) {
        estilo = data[0].estilo || '';
        tags = data[0].tags || [];
      } else if (data.estilo && data.tags) {
        estilo = data.estilo;
        tags = data.tags;
      } else if (data.result) {
        estilo = data.result;
      }

      return {
        file,
        result: estilo,
        tags,
      };
    });

    return Promise.all(uploadPromises);
  }

  /**
   * Compress an image file
   */
  static async compressImage(
    file: File,
    maxSize = 550,
    quality = 0.7
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      
      img.onload = () => {
        let { width, height } = img;
        
        // Calculate new dimensions
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          } else {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        // Create canvas and compress
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Canvas not supported'));
        }

        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('Compression failed'));
            }
            
            const ext = file.type === 'image/png' ? 'png' : 'jpeg';
            const compressedFile = new File([blob], file.name, {
              type: `image/${ext}`,
            });
            
            resolve(compressedFile);
          },
          file.type === 'image/png' ? 'image/png' : 'image/jpeg',
          quality
        );
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }
}
