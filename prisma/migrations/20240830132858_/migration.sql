-- CreateTable
CREATE TABLE "Bill" (
    "id" SERIAL NOT NULL,
    "measure_uuid" TEXT NOT NULL,
    "customer_code" TEXT NOT NULL,
    "measure_datetime" TIMESTAMP(3) NOT NULL,
    "measure_type" TEXT NOT NULL,
    "measure_value" INTEGER NOT NULL,
    "has_confirmed" BOOLEAN NOT NULL,
    "image_url" TEXT NOT NULL,

    CONSTRAINT "Bill_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bill_measure_uuid_key" ON "Bill"("measure_uuid");
