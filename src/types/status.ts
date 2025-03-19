import { Car } from '@prisma/client';

export interface Status {
  id: string;
  order?: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  cars?: Car[];
}
