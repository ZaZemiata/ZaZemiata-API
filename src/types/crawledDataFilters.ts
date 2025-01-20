 export interface FilterOptions {
    page: number;
    limit: number;
    sourceId?: string | number;
    dateBefore?: string;
    dateAfter?: string;
    dateExact?: string;
    containsText?: string;
}