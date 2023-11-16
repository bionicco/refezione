import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, forkJoin, from, map } from 'rxjs';
import { CalendarEventGroup, CalendarEventRaw } from '../models/event';
import { LocalCantine, RemoteCantine } from '../models/cantine';
import { add } from 'date-fns';
import { SettingsService } from './settings.service';

const baseUrl = 'https://refezione-be.vercel.app/api';
const defaultAddDays = -7;

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  cantines: RemoteCantine[] = [];

  events: Subject<CalendarEventGroup[]> = new Subject();

  constructor(
    private http: HttpClient,
    private settingsService: SettingsService
  ) {
    this.getCantines().then(got => {
      got.subscribe((data) => {
        this.cantines = data;
      });
    });

    this.settingsService.updatedCantines.subscribe((data) => {
      this.updateEvents();
    });
  }

  async getCantines(): Promise<Observable<RemoteCantine[]>> {
    const myCatines = await this.settingsService.getMyCantines();
    return this.http.get<any>(`${baseUrl}/refezione`).pipe(map((res) => {
      res.forEach((cantine: RemoteCantine) => {
        cantine.isAdded = myCatines.find((c) => c.cantine.id === cantine.id) ? true : false;
      });
      this.settingsService.updateLocalCantinesValues(res);
      return res
    }));
  }

  updateEvents() {
    this.settingsService.getMyCantines().then((cantines) => {
      if (cantines.length === 0) {
        this.events.next([]);
        return;
      }
      this.getEvents(cantines).subscribe((data) => {
        this.events.next(data);
      });
    });
  }


  getEvents(cantines: LocalCantine[]): Observable<CalendarEventGroup[]> {
    return forkJoin(
      cantines.map(c =>           // <-- `Array#map` function
        this.downloadOrCached(c)
      )).pipe(map((items: CalendarEventRaw[][]) => {
        return this.normalizeEvents(items.reduce((acc, val) => acc.concat(val), []), cantines);
      }));
  }

  downloadOrCached(cantine: LocalCantine): Observable<CalendarEventRaw[]> {
    const date = add(new Date().setHours(0, 0, 0, 0), { days: defaultAddDays });
    return this.http.get<any>(`${baseUrl}/refezione?id=${cantine.cantine.id}&date=${date.toISOString()}`).pipe(
      catchError((err) => {
        return from(this.settingsService.getCacheResult(cantine))
      }),
      map((res) => {
        const items: CalendarEventRaw[] = res.data?.items || res;
        const r: CalendarEventRaw[] = items.map((item: CalendarEventRaw) => {
          item.cantine = cantine;
          return item;
        })
        this.settingsService.saveCacheResult(cantine, r)
        return r;
      }
      ))
  }

  normalizeEvents(events: CalendarEventRaw[], cantines: LocalCantine[]): CalendarEventGroup[] {
    const groups: CalendarEventGroup[] = [];
    events.forEach((event) => {
      const date = new Date(event.start.date);
      const group = groups.find((g) => g.date.getTime() === date.getTime());
      if (group) {
        group.events.push({
          foods: event.summary.split(event.cantine.cantine.separator).map(s => s.trim()),
          cantine: event.cantine,
        });
      } else {
        groups.push({
          date,
          events: [{
            foods: event.summary.split(event.cantine.cantine.separator).map(s => s.trim()),
            cantine: event.cantine,

          }],
        });
      }
    }
    );
    return groups.sort((a, b) => a.date.getTime() - b.date.getTime());
  }
}
