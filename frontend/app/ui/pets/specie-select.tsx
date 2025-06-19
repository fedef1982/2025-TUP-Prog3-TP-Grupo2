'use client';

import { useEffect, useState } from 'react';
import { fetchAllSpecies } from '@/app/lib/dataPets';
import { Species } from '@/app/lib/definitionsPets';

interface SpeciesSelectProps {
  defaultValue?: number | string;
  onChange?: (value: number) => void;
  className?: string;
  required?: boolean;
}

export function SpeciesSelect({
  defaultValue = '',
  onChange,
  className = '',
  required = true
}: SpeciesSelectProps) {
  const [species, setSpecies] = useState<Species[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSpecies() {
      try {
        const data = await fetchAllSpecies();
        setSpecies(data);
      } catch (error) {
        console.error('Error loading species:', error);
      } finally {
        setLoading(false);
      }
    }
    loadSpecies();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value);
    onChange?.(value);
  };

  if (loading) {
    return (
      <select 
        name="especie_id" 
        id="especie_id"
        className={`peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 ${className}`}
        disabled
      >
        <option value="">Cargando especies...</option>
      </select>
    );
  }

  return (
    <select 
      name="especie_id" 
      id="especie_id"
      defaultValue={defaultValue}
      onChange={handleChange}
      className={`peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 ${className}`}
      required={required}
    >
      <option value="">Seleccione una especie</option>
      {species.map((specie) => (
        <option key={specie.id} value={specie.id}>
          {specie.nombre}
        </option>
      ))}
    </select>
  );
}