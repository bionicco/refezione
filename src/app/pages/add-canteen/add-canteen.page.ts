import { Component, OnInit } from '@angular/core';
import { RemoteCanteen } from 'src/app/models/canteen';
import { EventsService } from 'src/app/services/events.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-add-canteen',
  templateUrl: './add-canteen.page.html',
  styleUrls: ['./add-canteen.page.scss'],
})
export class AddCanteenPage implements OnInit {

  canteens: RemoteCanteen[] = [];
  allCanteens: RemoteCanteen[] = [];


  constructor(
    private eventsService: EventsService,
    private settingsService: SettingsService
  ) { }

  async ngOnInit() {
    (await this.eventsService.getCanteens()).subscribe((data) => {
      this.allCanteens = data.sort((a, b) => (`${a.province}-${a.city}-${a.name}`).localeCompare(`${b.province}-${b.city}-${b.name}`));
      this.canteens = this.allCanteens;
    });
  }

  async ionViewWillEnter() {
    this.ngOnInit();
  }

  search(event: any) {
    const query: string = event.target.value.toLowerCase();
    this.canteens = this.allCanteens.filter((c) => {
      return query.split(' ').every((word) => `${c.province}-${c.city}-${c.name}-${c.description}`.toLowerCase().includes(word));
    });
  }

  async addCanteen(canteen: RemoteCanteen, isAlreadyAdded: boolean) {
    if (!isAlreadyAdded) {
      await this.settingsService.addNewCanteen(canteen);
    }
    this.settingsService.openCanteen(canteen.id);
  }

}
