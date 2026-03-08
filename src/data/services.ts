export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // minutes
}

export const defaultServices: Service[] = [
  { id: "1", name: "Corte", description: "Corte moderno personalizado de acordo com seu estilo", price: 35, duration: 30 },
  { id: "2", name: "Barba", description: "Alinhamento, modelagem e hidratação da barba", price: 25, duration: 20 },
  { id: "3", name: "Sobrancelha", description: "Design e alinhamento de sobrancelhas", price: 15, duration: 15 },
  { id: "4", name: "Luzes", description: "Coloração, mechas e luzes no cabelo", price: 80, duration: 60 },
  { id: "5", name: "Corte + Barba", description: "Combo de corte de cabelo e barba completa", price: 55, duration: 45 },
  { id: "6", name: "Corte + Sobrancelha", description: "Combo de corte de cabelo e design de sobrancelha", price: 45, duration: 40 },
  { id: "7", name: "Corte + Luzes", description: "Combo de corte com coloração e mechas", price: 100, duration: 80 },
  { id: "8", name: "Corte + Barba + Sobrancelha", description: "Pacote completo: corte, barba e sobrancelha", price: 65, duration: 55 },
];
