 export interface FilterOptions {
    page: number;
    limit: number;
    РИОСВ?: string;
    dateBefore?: string;
    dateAfter?: string;
    dateExact?: string;
    containsText?: string;
}