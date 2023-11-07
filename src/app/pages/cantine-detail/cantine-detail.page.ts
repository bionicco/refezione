import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalCantine } from 'src/app/models/cantine';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-cantine-detail',
  templateUrl: './cantine-detail.page.html',
  styleUrls: ['./cantine-detail.page.scss'],
})
export class CantineDetailPage implements OnInit {

  cantine!: LocalCantine;

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
        this.cantine = await this.settingsService.getCantine(id) ?? {} as LocalCantine;
      }
    })
    this.colors = this.settingsService.getColors();

  }

  update() {
    this.settingsService.updateCantine(this.cantine);
  }

  selectColor(color: string) {
    this.cantine.color = color;
    this.update();
  }

  delete() {

    this.settingsService.removeCantine(this.cantine);
    this.back();
  }

  back() {
    this.router.navigate(['/tabs/tab2']);
  }

}
