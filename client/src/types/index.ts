export interface SchemaField {
  name: string;
  type: 'string' | 'number' | 'email';
  label: string;
  required: boolean;
}

export interface Workshop {
  id: string;
  _id?: string;
  title: string;
  description: string;
  price: number;
  dates: string;
  capacity: number;
  schemaFields: SchemaField[];
}

export interface EnquiryResponse {
  success: boolean;
  message?: string;
  data?: {
    id: string;
    createdAt: string;
  };
  errors?: Record<string, string>;
}
