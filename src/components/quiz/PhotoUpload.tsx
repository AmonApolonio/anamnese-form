import React, { useRef, useState } from 'react';
import EnvConfig from '../../config/envConfig';

const MAX_PHOTOS = 4;
const MIN_PHOTOS = 1;

// Get the N8N_POST_URL from EnvConfig
const N8N_POST_URL = EnvConfig.getEnvVariable('VITE_STYLE_ANALYSIS_URL');

// Utility to compress image files using canvas
async function compressImage(file: File, maxSize = 550, quality = 0.7): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas not supported'));
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('Compression failed'));
          const ext = file.type === 'image/png' ? 'png' : 'jpeg';
          resolve(new File([blob], file.name, { type: `image/${ext}` }));
        },
        file.type === 'image/png' ? 'image/png' : 'image/jpeg',
        quality
      );
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

const PhotoUpload: React.FC<{
  onComplete: (photos: { file: File; result: string; tags?: string[] }[]) => void,
  initialFiles?: { file: File; result: string; tags?: string[] }[]
}> = ({
  onComplete,
  initialFiles = []
}) => {
  const [selectedFiles, setSelectedFiles] = useState<(File | null)[]>(
    initialFiles.length > 0 ? initialFiles.map(f => f.file) : [null]
  );
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploaded, setUploaded] = useState<boolean>(initialFiles.length > 0);
  const [uploadedResults, setUploadedResults] = useState<{ file: File; result: string; tags?: string[] }[]>(
    initialFiles.length > 0 ? [...initialFiles] : []
  );
  const fileInputs = useRef<(HTMLInputElement | null)[]>([]);

  // If initialFiles changes (e.g. navigating back), update state
  React.useEffect(() => {
    if (initialFiles.length > 0) {
      setSelectedFiles([...initialFiles.map(f => f.file)]);
      setUploaded(true);
    }
  }, [initialFiles]);

  // Reset uploaded state if files are removed or changed
  React.useEffect(() => {
    const filesCount = selectedFiles.filter(f => f !== null).length;
    if (uploaded && filesCount < initialFiles.length) {
      setUploaded(false);
    }
    if (uploaded && filesCount === 0) {
      setUploaded(false);
    }
  }, [selectedFiles, initialFiles.length, uploaded]);

  // Ensure there's always one empty slot after the last selected photo (up to MAX_PHOTOS)
  const getDisplayFiles = () => {
    const files = selectedFiles.filter(f => f !== null);
    if (files.length < MAX_PHOTOS) {
      return [...files, null];
    }
    return files;
  };

  // Handle file selection for a specific slot
  const handleFileChange = async (
    idx: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files || !e.target.files[0]) return;
    let file = e.target.files[0];
    // Prevent duplicate files (by name and size)
    if (
      selectedFiles.some(
        (f, i) =>
          f &&
          f.name === file.name &&
          f.size === file.size &&
          i !== idx
      )
    ) {
      setError('Esta foto já foi selecionada.');
      return;
    }
    // Compress the image before saving
    try {
      file = await compressImage(file, 550, 0.7);
    } catch (err) {
      setError('Erro ao comprimir a imagem.');
      return;
    }
    setSelectedFiles((prev) => {
      const files = prev.filter(f => f !== null);
      files[idx] = file;
      // If not at max, always keep one empty slot at the end
      if (files.length < MAX_PHOTOS) {
        return [...files, null];
      }
      return files;
    });
    setError(null);
    // Reset input value so the same file can be selected again if removed
    if (fileInputs.current[idx]) fileInputs.current[idx]!.value = '';
  };

  // Remove a selected file from a slot
  const handleRemove = (idx: number) => {
    setSelectedFiles((prev) => {
      const files = prev.filter(f => f !== null);
      files.splice(idx, 1);
      // Always keep at least one empty slot if less than max
      if (files.length < MAX_PHOTOS) {
        return [...files, null];
      }
      return files;
    });
    setError(null);
  };

  // Open file picker for a slot
  const handleSlotClick = (idx: number) => {
    if (fileInputs.current[idx]) {
      fileInputs.current[idx]!.click();
    }
  };

  // Send each photo in a separate POST request and collect n8n result
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const filesToSend = selectedFiles.filter(f => f) as File[];
    if (!filesToSend.length) {
      setError('Por favor, selecione pelo menos 1 foto.');
      return;
    }
    setError(null);
    setUploading(true);
    if (!N8N_POST_URL) {
      setError('URL de envio não configurada.');
      setUploading(false);
      return;
    }
    try {
      const uploadPromises = filesToSend.map(async (file, idx) => {
        const formData = new FormData();
        formData.append(`data`, file);
        const res = await fetch(N8N_POST_URL, {
          method: 'POST',
          body: formData,
        });
        if (!res.ok) throw new Error(`Erro ao enviar foto ${idx + 1}`);
        const data = await res.json();
        let estilo = '';
        let tags: string[] = [];
        if (Array.isArray(data) && data[0]) {
          estilo = data[0].estilo;
          tags = data[0].tags;
        } else if (data.estilo && data.tags) {
          estilo = data.estilo;
          tags = data.tags;
        } else if (data.result) {
          estilo = data.result;
        }
        return { file, result: estilo, tags };
      });
      const results = await Promise.all(uploadPromises);
      setUploading(false);
      setUploaded(true);
      setUploadedResults(results);
      onComplete(results);
    } catch (err) {
      setError('Erro ao enviar as fotos.');
      setUploading(false);
      setUploaded(false);
      setUploadedResults([]);
      console.error('Erro ao enviar fotos:', err);
    }
  };

  const displayFiles = getDisplayFiles();

  return (
    <div className="bg-[#F5F0EA] flex flex-col items-center">
      <div className="w-full max-w-xl">
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center border border-[#947B62]">
          <h3 className="text-lg font-semibold text-[#947B62] mb-2 w-full text-left">
            Fotos dos seus looks favoritos
          </h3>
          <p className="text-[#947B62] mb-6 w-full text-left">
            Por favor, envie até 4 fotos usando seus looks favoritos para completar o quiz.
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center w-full"
          >
            <div className="grid grid-cols-2 gap-4 w-full mb-4">
              {displayFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="relative w-full aspect-square bg-[#F5F0EA] rounded flex items-center justify-center cursor-pointer border border-[#947B62] group overflow-hidden"
                  onClick={() => handleSlotClick(idx)}
                  tabIndex={0}
                  role="button"
                  aria-label={file ? `Alterar foto ${idx + 1}` : `Selecionar foto ${idx + 1}`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    ref={el => {
                      fileInputs.current[idx] = el;
                    }}
                    onChange={e => handleFileChange(idx, e)}
                  />
                  {file ? (
                    <>
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`preview-${idx}`}
                        className="w-full h-full object-cover rounded"
                      />
                      {/* Loading spinner overlay */}
                      {uploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-10">
                          <div className="w-8 h-8 border-4 border-white border-t-[#947B62] rounded-full animate-spin"></div>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          handleRemove(idx);
                        }}
                        className="absolute top-2 right-2 bg-[#947B62] text-white rounded-full w-8 h-8 aspect-square flex items-center justify-center text-xl shadow transition hover:bg-[#7a624a] focus:outline-none focus:ring-2 focus:ring-[#947B62]"
                        title="Remover foto"
                        disabled={false}
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <span className="text-4xl text-[#947B62] group-hover:text-white group-hover:bg-[#947B62] rounded-full px-2 py-1 transition select-none aspect-square">＋</span>
                  )}
                </div>
              ))}
            </div>
            {error && (
              <p className="text-red-500 mb-2 text-center w-full">{error}</p>
            )}
            <button
              type="submit"
              className="bg-[#947B62] text-white px-6 py-2 rounded font-semibold shadow hover:bg-[#7a624a] transition disabled:opacity-50 w-full mt-2"
              disabled={!(displayFiles.some(f => f) && !uploading) || uploaded}
            >
              {uploaded ? 'Fotos processadas' : uploading ? 'Processando...' : 'Enviar Fotos'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PhotoUpload;
