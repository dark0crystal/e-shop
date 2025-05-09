/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Variation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Variation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Variation" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Variation_slug_key" ON "Variation"("slug");
