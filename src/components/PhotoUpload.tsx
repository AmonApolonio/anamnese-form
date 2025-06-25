import React, { useRef, useState } from 'react';

const MAX_PHOTOS = 4;
const MIN_PHOTOS = 1;

// Get the N8N_POST_URL from Vite env
const N8N_POST_URL = import.meta.env.VITE_N8N_POST_URL;

const PhotoUpload: React.FC<{ onComplete: (photos: File[]) => void, onSkip?: () => void }> = ({
  onComplete,
  onSkip,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<(File | null)[]>([null]);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const fileInputs = useRef<(HTMLInputElement | null)[]>([]);

  // Ensure there's always one empty slot after the last selected photo (up to MAX_PHOTOS)
  const getDisplayFiles = () => {
    const files = selectedFiles.filter(f => f !== null);
    if (files.length < MAX_PHOTOS) {
      return [...files, null];
    }
    return files;
  };

  // Handle file selection for a specific slot
  const handleFileChange = (
    idx: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
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

  // Send each photo in a separate POST request
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const filesToSend = selectedFiles.filter(f => f);
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
      // Send each photo in a separate request
      const uploadPromises = filesToSend
        .map((file, idx) => {
          if (!file) return null;
          const formData = new FormData();
          formData.append(`data`, file);
          return fetch(N8N_POST_URL, {
            method: 'POST',
            body: formData,
          }).then(res => {
            if (!res.ok) throw new Error(`Erro ao enviar foto ${idx + 1}`);
          });
        })
        .filter(Boolean) as Promise<void>[];
      await Promise.all(uploadPromises);
      setUploading(false);
      onComplete(filesToSend as File[]);
    } catch (err) {
      setError('Erro ao enviar as fotos.');
      setUploading(false);
      console.error('Erro ao enviar fotos:', err);
    }
  };

  // Handle skip
  const handleSkip = () => {
    if (onSkip) onSkip();
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
            Por favor, envie até 4 fotos usando seus looks favoritos para completar o quiz. Você pode pular esta etapa.
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
            <div className="flex w-full justify-end items-center mb-2">
              {onSkip && (
                <button
                  type="button"
                  className="text-[#947B62] underline ml-4"
                  onClick={handleSkip}
                  disabled={uploading}
                >
                  Pular
                </button>
              )}
            </div>
            {error && (
              <p className="text-red-500 mb-2 text-center w-full">{error}</p>
            )}
            <button
              type="submit"
              className="bg-[#947B62] text-white px-6 py-2 rounded font-semibold shadow hover:bg-[#7a624a] transition disabled:opacity-50 w-full mt-2"
              disabled={!(displayFiles.some(f => f) && !uploading)}
            >
              {uploading ? 'Processando...' : 'Enviar Fotos'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PhotoUpload;
