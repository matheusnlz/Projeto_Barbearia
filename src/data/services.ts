export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // minutes
}

export const defaultServices: Service[] = [
  { id: "1", name: "Corte", description: "Corte moderno personalizado de acordo com seu estilo", price: 40, duration: 30 },
  { id: "2", name: "Barba", description: "Alinhamento, modelagem e hidratação da barba", price: 30, duration: 20 },
  { id: "3", name: "Sobrancelha", description: "Design e alinhamento de sobrancelhas", price: 10, duration: 10 },
  { id: "4", name: "Luzes", description: "Coloração, mechas e luzes no cabelo", price: 80, duration: 90 },
  { id: "5", name: "Corte + Barba", description: "Combo de corte de cabelo e barba completa", price: 70, duration: 50 },
  { id: "6", name: "Corte + Sobrancelha", description: "Combo de corte de cabelo e design de sobrancelha", price: 45, duration: 40 },
  { id: "7", name: "Corte + Luzes", description: "Combo de corte com coloração e mechas", price: 130, duration: 100 },
  { id: "8", name: "Corte + Barba + Sobrancelha", description: "Pacote completo: corte, barba e sobrancelha", price: 80, duration: 60 },
];
