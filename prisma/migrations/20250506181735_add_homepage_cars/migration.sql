-- CreateTable
CREATE TABLE "homepage_cars" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "car_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "homepage_cars_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "homepage_cars_car_id_key" ON "homepage_cars"("car_id");

-- CreateIndex
CREATE UNIQUE INDEX "homepage_cars_order_key" ON "homepage_cars"("order");

-- AddForeignKey
ALTER TABLE "homepage_cars" ADD CONSTRAINT "homepage_cars_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "cars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
