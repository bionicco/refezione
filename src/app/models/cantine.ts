export interface RemoteCantine {
    id: number,
    name: string,
    calendarId: string,
    description: string,
    city: string,
    province: string,
    separator: string,
    isAdded?: boolean,
    sharing?: string,
}

export interface LocalCantine {
    name: string,
    color?: string,
    cantine: RemoteCantine,
    notifications: boolean,
}