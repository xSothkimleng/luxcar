// export interface Car {
//   id: string;
//   name: string;
//   price: number;
//   color: string;
//   description: string;
//   images: string[];
//   featured?: boolean;
//   brand?: string;
//   type?: string;
//   status?: string;
//   dateAdded?: string;
// }

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
  createdAt: string;
  updatedAt: string;

  // Related entities (from join queries)
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
