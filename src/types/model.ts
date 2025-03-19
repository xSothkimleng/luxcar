import { BannerSlide, Car } from '@prisma/client';

export interface Model {
  id: string;
  name: string;
  order: number;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  cars?: Car[];
  bannerSlides?: BannerSlide[];
}
