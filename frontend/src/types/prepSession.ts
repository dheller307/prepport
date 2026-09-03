import { Batch } from "./batch"

export interface PrepSession {
    id?: number
    batches?: Batch[]
    name: string
    sessionDate: string
    notes?: string
    createdAt?: string
}

export interface CreatePrepSessionRequest { 
    name: string
    sessionDate: string
    notes?: string
}