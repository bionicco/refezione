import { Component } from '@angular/core';
import { LocalCantine } from '../models/cantine';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {


  myCantines: LocalCantine[] = [];

  constructor(
    private settingsService: SettingsService
  ) {

  }

  afterViewInit() {
    this.settingsService.getMyCantines().then((data) => {
      this.myCantines = data;
    });
  }



  openCantine(cantine: LocalCantine) {
    this.settingsService.openCantine(cantine.cantine.id);
  }







}
