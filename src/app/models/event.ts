import { LocalCanteen } from "./canteen";

export interface CalendarEventRaw {
    summary: string,
    organizer: {
        displayName: string,
    }
    start?: CalendarRawDate,
    end?: CalendarRawDate,
    canteen: LocalCanteen,
    recurrence: string[],
    status: string,
    originalStartTime?: CalendarRawDate,
}

export interface CalendarRawDate {
    date: string;
}

export interface CalendarEvent {
    foods: string[],
    canteen: LocalCanteen
}

export interface CalendarEventGroup {
    date: Date,
    events: CalendarEvent[]
}
