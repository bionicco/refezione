import { Component, OnInit } from '@angular/core';
import { RemoteCantine } from 'src/app/models/cantine';
import { EventsService } from 'src/app/services/events.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-add-cantine',
  templateUrl: './add-cantine.page.html',
  styleUrls: ['./add-cantine.page.scss'],
})
export class AddCantinePage implements OnInit {

  cantines: RemoteCantine[] = [];
  allCantines: RemoteCantine[] = [];


  constructor(
    private eventsService: EventsService,
    private settingsService: SettingsService
  ) { }

  async ngOnInit() {
    (await this.eventsService.getCantines()).subscribe((data) => {
      this.allCantines = data.sort((a, b) => (`${a.province}-${a.city}-${a.name}`).localeCompare(`${b.province}-${b.city}-${b.name}`));
      this.cantines = this.allCantines;
    });
  }

  search(event: any) {
    const query = event.target.value.toLowerCase();
    this.cantines = this.allCantines.filter((c) => {
      return `${c.province}-${c.city}-${c.name}-${c.description}`.toLowerCase().includes(query);
    });
  }

  async addCantine(cantine: RemoteCantine, isAlreadyAdded: boolean) {
    if (!isAlreadyAdded) {
      await this.settingsService.addNewCantine(cantine);
    }
    this.settingsService.openCantine(cantine.id);
  }

}
