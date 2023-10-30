import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { CalendarEventGroup, CalendarEventRaw } from '../models/event';
import { Cantine } from '../models/cantine';

const baseUrl = 'https://refezione-be.vercel.app/api';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  cantines: Cantine[] = [];

  constructor(
    private http: HttpClient) {
    this.getCantines().subscribe((data) => {
      this.cantines = data;
    });
  }

  getCantines(): Observable<Cantine[]> {
    return this.http.get<any>(`${baseUrl}/refezione`).pipe(map((res) => {
      console.log("------- ~ EventsService ~ returnthis.http.get<any> ~ res:", res);
      return res.data
    }));
  }

  getEvents(): Observable<CalendarEventGroup[]> {
    const cantinesId = [1, 2];


    return forkJoin(
      cantinesId.map(id =>           // <-- `Array#map` function
        this.http.get<any>(`${baseUrl}/refezione?id=${id}`).pipe(map((res) => res.data.items))
      )).pipe(map((items: CalendarEventRaw[][]) => {
        return this.normalizeEvents(items.reduce((acc, val) => acc.concat(val), []));
      }));

    // return this.http.get<any>(`${baseUrl}/refezione?id=1`).pipe(map((res) => {
    //   console.log("------- ~ EventsService ~ returnthis.http.get<any> ~ res:", res);
    //   return this.normalizeEvents(res.data.items)
    // }));
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
