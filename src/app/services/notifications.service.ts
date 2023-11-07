import { Injectable } from '@angular/core';
import { SettingsService } from './settings.service';
import { EventsService } from './events.service';
import { Settings } from '../models/settings';
import { CalendarEventGroup } from '../models/event';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(
    private settingsService: SettingsService,
    private eventService: EventsService
  ) {
    this.settingsService.updatedSettings.subscribe((settings) => {
      this.setNotifications(settings);
    });
    this.eventService.events.subscribe((events) => {
      this.setNotifications(undefined, events);
    });
  }

  async setNotifications(settings?: Settings, events?: CalendarEventGroup[]) {
    if (!settings) {
      settings = await this.settingsService.getSettings();
    }
    if (!events) {
      const cantines = await this.settingsService.getMyCantines();
      events = await this.eventService.getEvents(cantines).toPromise();
    }



  }


}
