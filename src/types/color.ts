import { Car } from '@prisma/client';

export interface Color {
  id: string;
  name: string;
  rgb: string;
  createdAt?: string;
  updatedAt?: string;
  cars?: Car[];
}
