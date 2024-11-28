export type KeyWordType = {
    id?: string
    word: string
    priority: 'HIGH' | "LOW" | "CRITICAL" | "MEDIUM"
    active: boolean
    created_at?: string
}

