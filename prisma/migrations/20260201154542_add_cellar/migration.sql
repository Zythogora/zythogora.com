BEGIN;

-- CreateTable
CREATE TABLE "storage_locations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "storage_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cellar_items" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "serving_format" "serving_from" NOT NULL,
    "best_before_date" DATE,
    "purchase_date" DATE,
    "purchase_price" DECIMAL(12,2),
    "purchase_currency" CHAR(3),
    "purchase_location_id" TEXT,
    "storage_location_id" TEXT,
    "user_id" TEXT NOT NULL,
    "beer_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cellar_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "storage_locations_user_id_name_key" ON "storage_locations"("user_id", "name");

-- AddForeignKey
ALTER TABLE "storage_locations" ADD CONSTRAINT "storage_locations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cellar_items" ADD CONSTRAINT "cellar_items_purchase_location_id_fkey" FOREIGN KEY ("purchase_location_id") REFERENCES "purchase_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cellar_items" ADD CONSTRAINT "cellar_items_storage_location_id_fkey" FOREIGN KEY ("storage_location_id") REFERENCES "storage_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cellar_items" ADD CONSTRAINT "cellar_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cellar_items" ADD CONSTRAINT "cellar_items_beer_id_fkey" FOREIGN KEY ("beer_id") REFERENCES "beer_data"."beers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

COMMIT;
