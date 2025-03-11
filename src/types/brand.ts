import { Car } from '@prisma/client';

export interface Brand {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  cars?: Car[];
}
