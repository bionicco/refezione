import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalCanteen } from 'src/app/models/canteen';
import { SettingsService } from 'src/app/services/settings.service';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-canteen-detail',
  templateUrl: './canteen-detail.page.html',
  styleUrls: ['./canteen-detail.page.scss'],
})
export class CanteenDetailPage implements OnInit {

  canteen!: LocalCanteen;

  colors: string[] = [];

  public alertButtons = [
    {
      text: 'No',
      cssClass: 'alert-button-cancel',
    },
    {
      text: 'Si',
      cssClass: 'alert-button-confirm',
      handler: () => {
        this.delete();
      },
    },
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private settingsService: SettingsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(async (params) => {
      const id = params['id']
      if (id) {
        this.canteen = await this.settingsService.getCanteen(id) ?? {} as LocalCanteen;
      }
    })
    this.colors = this.settingsService.getColors();

  }

  update() {
    this.settingsService.updateCanteen(this.canteen);
  }

  selectColor(color: string) {
    this.canteen.color = color;
    this.update();
  }

  delete() {
    this.settingsService.removeCanteen(this.canteen);
    this.back();
  }

  back() {
    this.router.navigate(['/tabs/tab2']);
  }

  async addToCalendar() {
    if (this.canteen.canteen.sharing) {
      await Browser.open({ url: this.canteen.canteen.sharing });

    }
  }

}
