-- AlterTable
ALTER TABLE "banner_slides" ADD COLUMN     "model_id" TEXT;

-- AddForeignKey
ALTER TABLE "banner_slides" ADD CONSTRAINT "banner_slides_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "models"("id") ON DELETE SET NULL ON UPDATE CASCADE;
