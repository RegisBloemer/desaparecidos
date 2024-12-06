/*
  Warnings:

  - You are about to drop the `Img` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LocationHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Person` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Img" DROP CONSTRAINT "Img_personId_fkey";

-- DropForeignKey
ALTER TABLE "LocationHistory" DROP CONSTRAINT "LocationHistory_personId_fkey";

-- DropTable
DROP TABLE "Img";

-- DropTable
DROP TABLE "LocationHistory";

-- DropTable
DROP TABLE "Person";

-- CreateTable
CREATE TABLE "person" (
    "id" TEXT NOT NULL,
    "create_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "birthday" TIMESTAMP(3) NOT NULL,
    "gender" BOOLEAN,
    "nationality" CHAR(2) NOT NULL,
    "tattoo" VARCHAR(30),
    "main_photo" VARCHAR(255),
    "others" JSONB,

    CONSTRAINT "person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "location_history" (
    "id" TEXT NOT NULL,
    "person_id" TEXT NOT NULL,
    "visited_at" TIMESTAMP(3) NOT NULL,
    "location_id" TEXT NOT NULL,

    CONSTRAINT "location_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "location" (
    "id" TEXT NOT NULL,
    "city" VARCHAR(50) NOT NULL,
    "uf" CHAR(2) NOT NULL,
    "country" CHAR(2) NOT NULL,
    "neighborhood" VARCHAR(50),

    CONSTRAINT "location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "img" (
    "id" TEXT NOT NULL,
    "person_id" TEXT NOT NULL,
    "url" VARCHAR(255) NOT NULL,

    CONSTRAINT "img_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "person_id_idx" ON "person"("id");

-- AddForeignKey
ALTER TABLE "location_history" ADD CONSTRAINT "location_history_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "location_history" ADD CONSTRAINT "location_history_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "img" ADD CONSTRAINT "img_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
