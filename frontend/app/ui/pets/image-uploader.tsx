'use client';

import { PhotoIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

interface ImageUploaderProps {
  initialImages?: string[];
  userId: number;
}

export function ImageUploader({ initialImages = [], userId }: ImageUploaderProps) {
  const [images, setImages] = useState<string[]>(initialImages);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (initialImages.length > 0 && JSON.stringify(initialImages) !== JSON.stringify(images)) {
      setImages(initialImages);
    }
  }, [initialImages]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploading(true);
    
    try {
      const formData = new FormData();
      Array.from(e.target.files).forEach(file => {
        formData.append('files', file);
      });
      formData.append('userId', userId.toString());

      const response = await fetch('/lib/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const { savedPaths } = await response.json();
      const updatedImages = [...images, ...savedPaths.map((path: string) => 
        `/images/${path}` // Prepend /images/ to the path
      )].slice(0, 4);
      
      setImages(updatedImages);
      
      // Actualizar el campo hidden
      const fotosInput = document.getElementById('fotos_url') as HTMLInputElement;
      if (fotosInput) {
        fotosInput.value = JSON.stringify(updatedImages.map(img => 
          img.replace('http://localhost:3000/images/', '')
        ));
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error al subir imágenes: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {images.map((img, index) => (
          <div key={index} className="relative w-24 h-24">
            <img 
              src={img.startsWith('http') ? img : img}
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