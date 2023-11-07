import { LocalCantine } from "./cantine";

export interface CalendarEventRaw {
    summary: string,
    organizer: {
        displayName: string,
    }
    start: CalendarRawDate,
    end: CalendarRawDate,
    cantine: LocalCantine
}

export interface CalendarRawDate {
    date: string;
}

export interface CalendarEvent {
    foods: string[],
    cantine: LocalCantine
}

export interface CalendarEventGroup {
    date: Date,
    events: CalendarEvent[]
}
