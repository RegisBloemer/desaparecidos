-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "create_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "birthday" TIMESTAMP(3) NOT NULL,
    "gender" BOOLEAN NOT NULL,
    "nationality" CHAR(4) NOT NULL,
    "tattoo" VARCHAR(30),
    "mainPhoto" VARCHAR(255),
    "other" JSONB,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocationHistory" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "visitedAt" TIMESTAMP(3) NOT NULL,
    "city" VARCHAR(50) NOT NULL,
    "uf" CHAR(4) NOT NULL,
    "country" CHAR(4) NOT NULL,
    "neighborhood" VARCHAR(50),

    CONSTRAINT "LocationHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Img" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "imgUrl" VARCHAR(255) NOT NULL,

    CONSTRAINT "Img_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Person_id_idx" ON "Person"("id");

-- AddForeignKey
ALTER TABLE "LocationHistory" ADD CONSTRAINT "LocationHistory_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Img" ADD CONSTRAINT "Img_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
