export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // minutes
  active: boolean;
}

export interface ServiceInput {
  name: string;
  description: string;
  price: number;
  duration: number;
  active?: boolean;
}

export interface ServiceUpdate {
  name?: string;
  description?: string;
  price?: number;
  duration?: number;
  active?: boolean;
}
