export interface RemoteCanteen {
    id: number,
    name: string,
    calendarId: string,
    description: string,
    city: string,
    province: string,
    separator: string,
    isAdded?: boolean,
    sharing?: string,
    reference: {
        name: string,
        note?: string,
        email?: string,
        www?: string
    }
}

export interface LocalCanteen {
    name: string,
    color?: string,
    canteen: RemoteCanteen,
    notifications: boolean,
}