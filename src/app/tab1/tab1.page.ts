import { Component, ElementRef, ViewChild } from '@angular/core';
import { EventsService } from '../services/events.service';
import { CalendarEventGroup } from '../models/event';
import { IonAccordionGroup, IonContent } from '@ionic/angular';

import { format, isToday } from 'date-fns';

import { it } from 'date-fns/locale';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  public eventGroups: CalendarEventGroup[] = [];

  @ViewChild('accordionGroup', { static: true }) accordionGroup!: IonAccordionGroup;


  @ViewChild('today') todayElement!: ElementRef;


  @ViewChild(IonContent) content!: IonContent;

  dateFormat = 'yyyy/MM/dd';

  dfnsOptions = {
    locale: it,
    addSuffix: true
  };

  constructor(
    private eventsService: EventsService,
  ) {

    this.eventsService.getEvents().subscribe((data) => {
      this.eventGroups = data;

      this.toggleToday();
    });
  }


  toggleToday() {
    const nativeEl = this.accordionGroup;

    nativeEl.value = format(new Date(), this.dateFormat);

  };

  isToday(date: Date): boolean {
    return isToday(date);
  }



}


