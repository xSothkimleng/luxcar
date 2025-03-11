import { Car } from '@prisma/client';

export interface Model {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  cars?: Car[];
}
