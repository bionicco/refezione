import { Component, ViewChild } from '@angular/core';
import { EventsService } from '../services/events.service';
import { CalendarEventGroup } from '../models/event';
import { IonAccordionGroup } from '@ionic/angular';

import { format } from 'date-fns';

import { it } from 'date-fns/locale';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  public eventGroups: CalendarEventGroup[] = [];

  @ViewChild('accordionGroup', { static: true }) accordionGroup!: IonAccordionGroup;

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


  toggleToday = () => {
    const nativeEl = this.accordionGroup;

    nativeEl.value = format(new Date(), this.dateFormat);

  };



}


