'use client';

import { ReactElement } from 'react';

interface FormFieldProps {
  id: string;
  name: string;
  type: string;
  placeholder: string;
  required?: boolean;
  minLength?: number;
  pattern?: string;
  icon: React.ElementType;
  label: string;
  optional?: boolean;
}

export default function FormField({
  id,
  name,
  type,
  placeholder,
  required = false,
  minLength,
  pattern,
  icon: Icon,
  label,
  optional = false
}: FormFieldProps) {
  return (
    <div className="mb-6">
      <label className="mb-2 block text-sm font-medium text-gray-900" htmlFor={id}>
        {label} {optional && <span className="text-gray-500">(Opcional)</span>}
      </label>
      <div className="relative">
        <input
          className="peer block w-full rounded-lg border border-gray-300 py-3 pl-12 text-base outline-2 placeholder:text-gray-500"
          id={id}
          type={type}
          name={name}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          pattern={pattern}
        />
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-6 w-6 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
      </div>
    </div>
  );
}