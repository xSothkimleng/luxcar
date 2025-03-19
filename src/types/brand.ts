import { Car } from '@prisma/client';

export interface Brand {
  id: string;
  name: string;
  order?: number;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  cars?: Car[];
}
