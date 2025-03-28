import { Car } from '@prisma/client';

export interface Color {
  id: string;
  name: string;
  order: number;
  rgb: string;
  createdAt?: string;
  updatedAt?: string;
  cars?: Car[];
}
