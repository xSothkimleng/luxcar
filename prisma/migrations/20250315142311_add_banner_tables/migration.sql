-- CreateEnum
CREATE TYPE "BannerImageType" AS ENUM ('MAIN', 'BACKGROUND');

-- CreateTable
CREATE TABLE "banner_slides" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "main_image_id" TEXT,
    "bg_image_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banner_slides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banner_images" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "BannerImageType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banner_images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "banner_slides" ADD CONSTRAINT "banner_slides_main_image_id_fkey" FOREIGN KEY ("main_image_id") REFERENCES "banner_images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banner_slides" ADD CONSTRAINT "banner_slides_bg_image_id_fkey" FOREIGN KEY ("bg_image_id") REFERENCES "banner_images"("id") ON DELETE SET NULL ON UPDATE CASCADE;
