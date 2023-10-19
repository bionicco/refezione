import { Component } from '@angular/core';
import { BackgroundRunner } from '@capacitor/background-runner';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  checkins: any[] = [];

  constructor() { }

  async ngAfterViewInit() {
    try {
      const permissions = await BackgroundRunner.requestPermissions({
        apis: ['notifications', 'geolocation'],
      });
      console.log('permissions', permissions);
    } catch (err) {
      console.log(`ERROR: ${err}`);
    }
  } // Test the KV Store



  loadCheckins = async () => {
    const result = (await BackgroundRunner.dispatchEvent({
      label: 'com.capacitor.background.check',
      event: 'loadCheckins',
      details: {},
    })) as any;

    if (result) {
      this.checkins = [];
      Object.keys(result).forEach((key) => {
        this.checkins.push(result[key]);
      });
    }
  };



}
