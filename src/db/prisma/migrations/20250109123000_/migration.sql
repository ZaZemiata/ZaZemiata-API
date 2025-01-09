-- CreateEnum
CREATE TYPE "CrawlTaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateTable
CREATE TABLE "CrawlTasks" (
    "id" BIGSERIAL NOT NULL,
    "status" "CrawlTaskStatus" NOT NULL DEFAULT 'PENDING',
    "completed_at" TIMESTAMP(3),
    "error" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source_id" BIGINT NOT NULL,

    CONSTRAINT "CrawlTasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrawledData" (
    "id" BIGSERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contractor" VARCHAR(255),
    "source_url_id" BIGINT NOT NULL,

    CONSTRAINT "CrawledData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KeyWords" (
    "id" BIGSERIAL NOT NULL,
    "word" VARCHAR(64) NOT NULL,
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KeyWords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" BIGINT NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "value" VARCHAR(256) NOT NULL,
    "active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source_id" BIGINT NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SourceUrls" (
    "id" BIGINT NOT NULL,
    "url" VARCHAR(1024) NOT NULL,
    "active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source_id" BIGINT NOT NULL,

    CONSTRAINT "SourceUrls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sources" (
    "id" BIGINT NOT NULL,
    "site_name" TEXT NOT NULL,
    "worker_name" TEXT NOT NULL,
    "last_scrape_time" TIMESTAMP(3),
    "scrape_frequency_seconds" DOUBLE PRECISION NOT NULL,
    "active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "display_name" TEXT NOT NULL,

    CONSTRAINT "Sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" BIGSERIAL NOT NULL,
    "email" VARCHAR(128) NOT NULL,
    "password" VARCHAR(128) NOT NULL,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CrawledData_contractor_date_source_url_id_key" ON "CrawledData"("contractor", "date", "source_url_id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- AddForeignKey
ALTER TABLE "CrawlTasks" ADD CONSTRAINT "CrawlTasks_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "Sources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrawledData" ADD CONSTRAINT "CrawledData_source_url_id_fkey" FOREIGN KEY ("source_url_id") REFERENCES "SourceUrls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "Sources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SourceUrls" ADD CONSTRAINT "SourceUrls_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "Sources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
