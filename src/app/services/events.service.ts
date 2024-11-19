import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, forkJoin, from, map } from 'rxjs';
import { CalendarEventGroup, CalendarEventRaw } from '../models/event';
import { LocalCanteen, RemoteCanteen } from '../models/canteen';
import { add, format } from 'date-fns';
import { SettingsService } from './settings.service';
import { RRule } from 'rrule';

const baseUrl = 'https://refezione-be.vercel.app/api';
const defaultAddDays = -7;

const MAX_RECURRENCE = 10;

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  canteens: RemoteCanteen[] = [];

  events: Subject<CalendarEventGroup[]> = new Subject();

  constructor(
    private http: HttpClient,
    private settingsService: SettingsService
  ) {
    this.getCanteens().then(got => {
      got.subscribe((data) => {
        this.canteens = data;
      });
    });

    this.settingsService.updatedCanteens.subscribe((data) => {
      this.updateEvents();
    });
  }

  async getCanteens(): Promise<Observable<RemoteCanteen[]>> {
    const myCatines = await this.settingsService.getMyCanteens();
    return this.http.get<any>(`${baseUrl}/refezione`).pipe(map((res) => {
      res.forEach((canteen: RemoteCanteen) => {
        canteen.isAdded = myCatines.find((c) => c.canteen.id === canteen.id) ? true : false;
      });
      this.settingsService.updateLocalCanteensValues(res);
      return res
    }));
  }

  updateEvents() {
    this.settingsService.getMyCanteens().then((canteens) => {
      if (canteens.length === 0) {
        this.events.next([]);
        return;
      }
      this.getEvents(canteens).subscribe((data) => {
        this.events.next(data);
      });
    });
  }


  getEvents(canteens: LocalCanteen[]): Observable<CalendarEventGroup[]> {
    return forkJoin(
      canteens.map(c =>           // <-- `Array#map` function
        this.downloadOrCached(c)
      )).pipe(map((items: CalendarEventRaw[][]) => {
        return this.normalizeEvents(items.reduce((acc, val) => acc.concat(val), []), canteens);
      }));
  }

  downloadOrCached(canteen: LocalCanteen): Observable<CalendarEventRaw[]> {
    const date = add(new Date().setHours(0, 0, 0, 0), { days: defaultAddDays });
    return this.http.get<any>(`${baseUrl}/refezione?id=${canteen.canteen.id}&date=${date.toISOString()}`).pipe(
      catchError((err) => {
        return from(this.settingsService.getCacheResult(canteen))
      }),
      map((res) => {
        const items: CalendarEventRaw[] = res.data?.items || res;
        const r: CalendarEventRaw[] = items.map((item: CalendarEventRaw) => {
          item.canteen = canteen;
          return item;
        })
        this.settingsService.saveCacheResult(canteen, r)
        return r;
      }
      ))
  }

  normalizeEvents(events: CalendarEventRaw[], canteens: LocalCanteen[]): CalendarEventGroup[] {
    const groups: CalendarEventGroup[] = [];
    events.forEach((event) => {
      const startDate = new Date(event.start.date);
      let dates = [startDate];
      if (event.recurrence?.length) {
        let recurrence = event.recurrence[0];
        if (!recurrence.includes('COUNT') && !recurrence.includes('UNTIL')) {
          recurrence += ';COUNT=' + MAX_RECURRENCE;

        }
        const stringRule = `DTSTART:${format(startDate, 'yyyyMMdd')}T190000;\n${recurrence}`
        const rule = RRule.fromString(stringRule);
        dates = rule.all().map((d) => new Date(d));
      }
      dates.forEach((date) => {
        const group = groups.find((g) => g.date.getTime() === date.getTime());
        if (group) {
          group.events.push({
            foods: event.summary.split(event.canteen.canteen.separator).map(s => s.trim()),
            canteen: event.canteen,
          });
        } else {
          groups.push({
            date,
            events: [{
              foods: event.summary.split(event.canteen.canteen.separator).map(s => s.trim()),
              canteen: event.canteen,
            }],
          });
        }
      })
    }

    );
    return groups.sort((a, b) => a.date.getTime() - b.date.getTime());
  }
}
