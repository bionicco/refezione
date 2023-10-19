export interface CalendarEventRaw {
    summary: string,
    organizer: {
        displayName: string,
    }
    start: CalendarRawDate,
    end: CalendarRawDate,
}

export interface CalendarRawDate {
    date: string;
}

export interface CalendarEvent {
    foods: string[],
    displayName: string
}

export interface CalendarEventGroup {
    date: Date,
    events: CalendarEvent[]
}