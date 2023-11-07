import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EventsService } from '../services/events.service';
import { CalendarEventGroup } from '../models/event';
import { IonAccordionGroup, IonContent } from '@ionic/angular';

import { format, isToday } from 'date-fns';

import { it } from 'date-fns/locale';
import { DateFnsConfigurationService } from 'ngx-date-fns';
import { LocalCantine } from '../models/cantine';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  public eventGroups: CalendarEventGroup[] = [];

  public cantines: LocalCantine[] = [];

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
      this.eventGroups = data;
      this.cantines = await this.settingsService.getMyCantines();
      this.loading = false;
      this.toggleToday();
    });
  }

  ngOnInit() {
    this.loading = true;
    this.eventsService.updateEvents();
  }

  toggleToday() {
    const nativeEl = this.accordionGroup;

    nativeEl.value = format(new Date(), this.dateFormat);

  };

  isToday(date: Date): boolean {
    return isToday(date);
  }



}


