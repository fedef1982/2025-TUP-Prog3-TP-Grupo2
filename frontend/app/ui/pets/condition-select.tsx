'use client';

import { useEffect, useState } from 'react';
import { fetchAllConditions } from '@/app/lib/dataPets';
import { Condition } from '@/app/lib/definitionsPets';

interface ConditionSelectProps {
  defaultValue?: number | string;
  onChange?: (value: number) => void;
  className?: string;
  required?: boolean;
}

export function ConditionSelect({
  defaultValue = '',
  onChange,
  className = '',
  required = true
}: ConditionSelectProps) {
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadConditions() {
      try {
        const data = await fetchAllConditions();
        setConditions(data);
      } catch (error) {
        console.error('Error loading conditions:', error);
      } finally {
        setLoading(false);
      }
    }
    loadConditions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value);
    onChange?.(value);
  };

  if (loading) {
    return (
      <select 
        name="condicion_id" 
        id="condicion_id"
        className={`peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 ${className}`}
        disabled
      >
        <option value="">Cargando condiciones...</option>
      </select>
    );
  }

  return (
    <select 
      name="condicion_id" 
      id="condicion_id"
      defaultValue={defaultValue}
      onChange={handleChange}
      className={`peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 ${className}`}
      required={required}
    >
      <option value="">Seleccione una condición</option>
      {conditions.map((condition) => (
        <option key={condition.id} value={condition.id}>
          {condition.nombre}
        </option>
      ))}
    </select>
  );
}