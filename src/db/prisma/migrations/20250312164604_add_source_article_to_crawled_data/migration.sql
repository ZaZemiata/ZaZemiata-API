-- DropIndex
DROP INDEX "CrawledData_contractor_date_source_url_id_key";

-- AlterTable
ALTER TABLE "CrawlTasks" ADD COLUMN     "crawl_duration_seconds" DOUBLE PRECISION,
ADD COLUMN     "started_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "CrawledData" ADD COLUMN     "sourceArticle" VARCHAR(1024);
