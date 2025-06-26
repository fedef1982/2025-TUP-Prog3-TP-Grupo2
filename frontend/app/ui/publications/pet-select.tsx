'use client';

import { Pet } from '@/app/lib/definitionsPets';
import { useEffect, useState } from 'react';
import { fetchAllPets } from '@/app/lib/dataPets';

interface PetSelectProps {
  userId: number;
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
  required?: boolean;
}

export function PetSelect({
  userId,
  defaultValue = '',
  onChange,
  className = '',
  required = true
}: PetSelectProps) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPets() {
      try {
        const petsData = await fetchAllPets();
        setPets(petsData);
      } catch (error) {
        console.error('Error loading pets:', error);
      } finally {
        setLoading(false);
      }
    }
    loadPets();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onChange?.(value);
  };

  if (loading) {
    return (
      <select 
        className={`peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 ${className}`}
        disabled
      >
        <option>Cargando mascotas...</option>
      </select>
    );
  }

  return (
    <select 
      name="mascota_id" 
      id="mascota_id"
      defaultValue={defaultValue}
      onChange={handleChange}
      className={`peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 ${className}`}
      required={required}
    >
      <option value="">Seleccione una mascota</option>
      {pets.map((pet) => (
        <option key={pet.id} value={pet.id}>
          {pet.nombre}
        </option>
      ))}
    </select>
  );
}