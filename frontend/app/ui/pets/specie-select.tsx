'use client';

import { Species } from '@/app/lib/definitionsPets';

interface SpeciesSelectProps {
  species: Species[]; 
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
  required?: boolean;
}

export function SpeciesSelect({
  species = [],
  defaultValue = '',
  onChange,
  className = '',
  required = true
}: SpeciesSelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onChange?.(value);
  };

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