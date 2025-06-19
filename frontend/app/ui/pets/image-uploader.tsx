'use client';

import { PhotoIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

interface ImageUploaderProps {
  initialImages?: string[];
}

export function ImageUploader({ initialImages = [] }: ImageUploaderProps) {
  const [images, setImages] = useState<string[]>(initialImages);
  const [uploading, setUploading] = useState(false);

  // Sincronizar initialImages con el estado interno
  useEffect(() => {
    setImages(initialImages);
  }, [initialImages]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploading(true);
      
      // Simulamos la subida de imágenes
      const newImages = Array.from(e.target.files).map(file => 
        URL.createObjectURL(file)
      );
      
      setTimeout(() => {
        const updatedImages = [...images, ...newImages].slice(0, 4); // Máximo 4 imágenes
        setImages(updatedImages);
        
        // Actualizar el campo hidden
        const fotosInput = document.getElementById('fotos_url') as HTMLInputElement;
        if (fotosInput) {
          fotosInput.value = JSON.stringify(updatedImages);
        }
        
        setUploading(false);
      }, 1000);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {images.map((img, index) => (
          <div key={index} className="relative w-24 h-24">
            <img 
              src={img} 
              alt={`Preview ${index}`} 
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        ))}
      </div>
      
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <PhotoIcon className="w-8 h-8 mb-3 text-gray-500" />
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">Click para subir fotos</span> o arrastra y suelta
          </p>
          <p className="text-xs text-gray-500">PNG, JPG (MAX. 5MB c/u)</p>
        </div>
        <input 
          id="dropzone-file" 
          type="file" 
          className="hidden" 
          multiple 
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading || images.length >= 4}
        />
      </label>
      {uploading && <p className="mt-2 text-sm text-gray-500">Subiendo imágenes...</p>}
      {images.length >= 4 && (
        <p className="mt-2 text-sm text-yellow-600">Máximo 4 imágenes alcanzado</p>
      )}
    </div>
  );
}