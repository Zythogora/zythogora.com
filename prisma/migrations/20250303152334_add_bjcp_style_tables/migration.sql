BEGIN;

-- CreateTable
CREATE TABLE "beer_data"."style_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "style_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beer_data"."styles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category_id" TEXT NOT NULL,

    CONSTRAINT "styles_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "beer_data"."styles" ADD CONSTRAINT "styles_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "beer_data"."style_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateIndex
CREATE UNIQUE INDEX "style_categories_name_key" ON "beer_data"."style_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "styles_name_key" ON "beer_data"."styles"("name");

COMMIT;
