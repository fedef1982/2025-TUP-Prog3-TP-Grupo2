// Definiciones para usuarios

export interface Donation {
  id: number;
  destinatario: string;
  cbu?: string;
  cuit?: string;
  entidad_financiera: string;
  tipo_cuenta?: string;
  alias: string;
  link_pago?: string;
  motivo_donacion?: string;
  usuario_id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface EditDonationFormProps {
  user: EditDonationFormData;
}

export interface EditDonationFormData{
  id: number;
  destinatario: string;
  cbu: string;
  cuit: string;
  entidad_financiera: string;
  tipo_cuenta: string;
  alias: string;
  link_pago: string;
  motive_donacton: string;
}

export interface CreateDonationState {
  message?: string;
  errors?: {
    destinatario?: string[];
    entidad_financiera?: string[];
    alias?: string[];
  };
  success?: boolean;
}; 

export interface UpdateDonationState {
  message?: string;
  errors?: {
    destinatario?: string[];
    entidad_financiera?: string[];
    alias?: string[];
  };
  success?: boolean;
}

export interface CreateDonationDto {
  destinatario: string;
  cbu: string;
  cuit: string;
  entidad_financiera: string;
  tipo_cuenta: string;
  alias: string;
  link_pago: string;
  motivo_donacion: string;
  usuario_id: number;
}


export interface UpdateDonationDto {
  destinatario?: string;
  cbu?: string;
  cuit?: string;
  entidad_financiera?: string;
  tipo_cuenta?: string;
  alias?: string;
  link_pago?: string;
  motivo_donacion?: string;
}

export interface FilteredDonationsParams {
  query?: string;
  page?: number;
  limit?: number;
  destinatario?: string;
  entidad_financiera?: string;
  alias?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DonationsTable {
  id: string;
  destinatario: string;
  entidad_financiera: string;
  alias: string;
  link_pago?: string;
  motivo_donacion?: string;
  usuario_id: string;
  createdAt?: string;
};

export interface DonationForm {
  id: string;
  destinatario: string;
  cbu?: string;
  cuit?: string;
  entidad_financiera: string;
  tipo_cuenta?: string;
  alias: string;
  link_pago?: string;
  motivo_donacion?: string;
  status: boolean;
};

export interface FilteredDonations {
  id: string;
  destinatario: string;
  cbu?: string;
  cuit?: string;
  entidad_financiera: string;
  tipo_cuenta?: string;
  alias: string;
  link_pago?: string;
  motivo_donacion?: string;
  usuario_id: number;
  createdAt?: string;
  status: string;
}
