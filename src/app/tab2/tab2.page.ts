import { Component, OnInit } from '@angular/core';
import { LocalCanteen } from '../models/canteen';
import { SettingsService } from '../services/settings.service';
import { Settings } from '../models/settings';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  settings: Settings = {} as Settings;

  hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

  minutes = [0, 10, 20, 30, 40, 50];

  myCanteens: LocalCanteen[] = [];

  constructor(
    private settingsService: SettingsService
  ) {

  }

  async ngOnInit() {
    this.settingsService.getMyCanteens().then((data) => {
      this.myCanteens = data;
    });

    this.settingsService.updatedCanteens.subscribe((data) => {
      this.myCanteens = data;
    });

    this.settings = await this.settingsService.getSettings();
  }



  openCanteen(canteen: LocalCanteen) {
    this.settingsService.openCanteen(canteen.canteen.id);
  }

  setNotification(event: any) {
    this.settings.notifications = event.detail.checked;
    this.updateSettings()

  }

  changeTimeMinutes(event: any) {
    this.settings.notificationsTimeMinute = event.detail.value;
    this.updateSettings()
  }
  changeTimeHours(event: any) {
    this.settings.notificationsTimeHour = event.detail.value;
    this.updateSettings()
  }

  changeNotificationDay(event: any) {
    this.settings.notificationsDay = event.detail.value;
    this.updateSettings()
  }

  updateSettings() {
    this.settingsService.updateSettings(this.settings);
  }







}
