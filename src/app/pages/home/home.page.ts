import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { RemoteCanteen } from 'src/app/models/canteen';
import { EventsService } from 'src/app/services/events.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {


  canteens: RemoteCanteen[] = [];

  constructor(
    private platform: Platform,
    private router: Router,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    if (this.platform.is('android')) {
      this.router.navigate(['/tabs']);
    } else {
      this.loadCanteens();
    }
  }

  async loadCanteens() {
    (await this.eventsService.getCanteens()).subscribe((data) => {
      this.canteens = data.sort((a, b) => (`${a.province}-${a.city}-${a.name}`).localeCompare(`${b.province}-${b.city}-${b.name}`));

    });
  }

  goToCanteen(canteen: RemoteCanteen) {
    this.router.navigate(['/canteen-menu'], { queryParams: { id: canteen.id } });
  }

}
