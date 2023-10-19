import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CalendarEventGroup, CalendarEventRaw } from '../models/event';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(
    private http: HttpClient) { }

  getEvents(): Observable<CalendarEventGroup[]> {

    return this.http.get<any>(`https://refezione-be.vercel.app/api/refezione?id=1`).pipe(map((res) => {
      console.log("------- ~ EventsService ~ returnthis.http.get<any> ~ res:", res);
      return this.normalizeEvents(res.data.items)
    }));
  }

  normalizeEvents(events: CalendarEventRaw[]): CalendarEventGroup[] {
    console.log("------- ~ EventsService ~ normalizeEvents ~ events:", events);
    const groups: CalendarEventGroup[] = [];
    events.forEach((event) => {
      const date = new Date(event.start.date);
      const group = groups.find((g) => g.date.getTime() === date.getTime());
      if (group) {
        group.events.push({
          foods: event.summary.split(','),
          displayName: event.organizer.displayName,
        });
      } else {
        groups.push({
          date,
          events: [{
            foods: event.summary.split(','),
            displayName: event.organizer.displayName,

          }],
        });
      }
    }
    );
    return groups.sort((a, b) => a.date.getTime() - b.date.getTime());
  }
}
