'use client';

import { Condition } from '@/app/lib/definitionsPets';

interface ConditionSelectProps {
  conditions: Condition[];  // Recibimos las condiciones como prop
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
  required?: boolean;
}

export function ConditionSelect({
  conditions = [],
  defaultValue = '',
  onChange,
  className = '',
  required = true
}: ConditionSelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onChange?.(value);
  };

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