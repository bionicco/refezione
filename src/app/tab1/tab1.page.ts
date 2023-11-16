import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EventsService } from '../services/events.service';
import { CalendarEventGroup } from '../models/event';
import { IonAccordionGroup, IonContent } from '@ionic/angular';

import { isToday } from 'date-fns';
import { isAfter } from 'date-fns';

import { it } from 'date-fns/locale';
import { DateFnsConfigurationService } from 'ngx-date-fns';
import { LocalCanteen } from '../models/canteen';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  public eventGroupsPast: CalendarEventGroup[] = [];
  public eventGroupsFuture: CalendarEventGroup[] = [];

  public canteens: LocalCanteen[] = [];

  @ViewChild('accordionGroup', { static: true }) accordionGroup!: IonAccordionGroup;


  @ViewChild('today') todayElement!: ElementRef;


  @ViewChild(IonContent) content!: IonContent;

  dateFormat = 'yyyy/MM/dd';

  loading = false;

  dfnsOptions = {
    locale: it,
    addSuffix: true
  };

  constructor(
    private eventsService: EventsService,
    public config: DateFnsConfigurationService,
    public settingsService: SettingsService
  ) {

    this.config.setLocale(it);
    this.eventsService.events.subscribe(async (data) => {
      this.canteens = await this.settingsService.getMyCanteens();
      this.eventGroupsPast = data.filter((x) => !isAfter(x.date, new Date()) && !isToday(x.date));
      this.eventGroupsFuture = data.filter((x) => isAfter(x.date, new Date()) || isToday(x.date));
      // this.eventGroups = data;
      this.loading = false;
      this.toggleToday();
    });
  }

  ngOnInit() {
    this.loading = true;
    this.eventsService.updateEvents();
  }

  toggleToday() {
    // const nativeEl = this.accordionGroup;
    // nativeEl.value = format(new Date(), this.dateFormat);

    setTimeout(() => {
      if (this.todayElement) {
        this.todayElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 200);

  };

  isToday(date: Date): boolean {
    return isToday(date);
  }



}


