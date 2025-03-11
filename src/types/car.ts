export interface Car {
  id: string;
  name: string;
  price: number;
  scale: string;
  description: string;
  colorId: string;
  brandId: string;
  modelId: string;
  thumbnailImageId: string | null;
  createdAt?: string;
  updatedAt?: string;

  color?: {
    id: string;
    name: string;
    rgb: string;
  };
  brand?: {
    id: string;
    name: string;
  };
  model?: {
    id: string;
    name: string;
  };
  thumbnailImage?: {
    id: string;
    url: string;
  };
  variantImages?: {
    id: string;
    url: string;
    carId: string;
  }[];
}
