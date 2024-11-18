
import { DateFnsConfigurationService } from 'ngx-date-fns';
import { LocalCanteen, RemoteCanteen } from 'src/app/models/canteen';
import { EventsService } from 'src/app/services/events.service';

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CalendarEventGroup } from 'src/app/models/event';
import { IonContent } from '@ionic/angular';

import { isToday } from 'date-fns';
import { isAfter } from 'date-fns';

import { it } from 'date-fns/locale';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom } from 'rxjs';


@Component({
  selector: 'app-canteen-menu',
  templateUrl: './canteen-menu.page.html',
  styleUrls: ['./canteen-menu.page.scss'],
})
export class CanteenMenuPage implements OnInit {


  public eventGroupsPast: CalendarEventGroup[] = [];
  public eventGroupsFuture: CalendarEventGroup[] = [];

  public canteen?: RemoteCanteen;

  canteenId = 0;

  loading = true;


  dateFormat = 'yyyy/MM/dd';

  dfnsOptions = {
    locale: it,
    addSuffix: true
  };


  @ViewChild('today') todayElement!: ElementRef;


  @ViewChild(IonContent) content!: IonContent;


  constructor(
    private eventsService: EventsService,
    public config: DateFnsConfigurationService,
    public activatedRoute: ActivatedRoute
  ) {

    this.config.setLocale(it);
  }


  async ngOnInit() {
    this.loading = true;

    this.activatedRoute.queryParams.subscribe(async (params) => {
      this.canteenId = params['id'];
      await this.loadCanteen(this.canteenId);
      await this.loadEvents();

      this.loading = false;

    });

    // this.toggleToday();

  }

  async loadCanteen(canteenId: number) {
    const data = await lastValueFrom((await this.eventsService.getCanteens()));
    if (data) {
      this.canteen = data.find((x) => x.id == this.canteenId);
    }
  }

  async loadEvents() {
    const localCantine: LocalCanteen = {
      name: this.canteen!.description,
      canteen: this.canteen!,
      notifications: false
    };

    const data = await lastValueFrom(this.eventsService.getEvents([localCantine!]));
    this.eventGroupsPast = data.filter((x) => !isAfter(x.date, new Date()) && !isToday(x.date));
    if (this.eventGroupsPast.length > 2) {
      this.eventGroupsPast = this.eventGroupsPast.slice(this.eventGroupsPast.length - 2);
    }
    this.eventGroupsFuture = data.filter((x) => isAfter(x.date, new Date()) || isToday(x.date));
    // this.eventGroups = data;


  }

  // toggleToday() {
  //   setTimeout(() => {
  //     if (this.todayElement) {
  //       console.log("------- ~ CanteenMenuPage ~ setTimeout ~ this.todayElement:", this.todayElement);
  //       this.todayElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
  //     }
  //   }, 500);

  // };

  isToday(date: Date): boolean {
    return isToday(date);
  }

}
