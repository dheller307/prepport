import { Batch } from "./batch"

export interface PrepSession {
    id?: number
    batches?: Batch[]
    sessionDate: string
    notes?: string
    createdAt?: string
}

export interface CreatePrepSessionRequest { 
    sessionDate: string
    notes?: string
}