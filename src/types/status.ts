import { Car } from '@prisma/client';

export interface Status {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  cars?: Car[];
}
