import { CrawledData } from "@prisma/client"

export type PaginationResult = {
    total?: number,
    data?: CrawledData[],
    error?: string
}