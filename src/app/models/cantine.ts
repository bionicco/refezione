export interface RemoteCantine {
    id: number,
    name: string,
    calendarId: string,
    description: string,
    city: string,
    province: string,
}

export interface LocalCantine {
    name: string,
    color?: string,
    cantine: RemoteCantine,
}