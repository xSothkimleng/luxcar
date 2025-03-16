// types/banner.ts

import { Model } from '@prisma/client';

export enum BannerImageType {
  MAIN = 'MAIN',
  BACKGROUND = 'BACKGROUND',
}

export interface BannerImage {
  id: string;
  url: string;
  type: BannerImageType;
  createdAt?: string;
  updatedAt?: string;
}

export interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  modelId?: string;
  mainImageId: string;
  bgImageId: string;
  createdAt?: string;
  updatedAt?: string;

  // Relations
  model?: Model;
  mainImage?: BannerImage;
  bgImage?: BannerImage;
}

// Create/Update types
export interface CreateBannerSlideData {
  title: string;
  subtitle: string;
  modelId?: string;
  mainImageId: string;
  bgImageId: string;
}

export interface UpdateBannerSlideData {
  title?: string;
  subtitle?: string;
  modelId?: string;
  mainImageId?: string;
  bgImageId?: string;
}

// Form data types
export interface BannerSlideFormData {
  title: string;
  subtitle: string;
  modelId?: string;
  mainImage?: {
    id: string;
    url: string;
  };
  bgImage?: {
    id: string;
    url: string;
  };
}
