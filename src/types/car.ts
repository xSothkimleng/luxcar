export interface Car {
  id: string;
  name: string;
  price: number;
  color: string;
  description: string;
  images: string[];
  featured?: boolean;
  brand?: string;
  type?: string;
}
