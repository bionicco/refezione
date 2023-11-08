import { Component } from '@angular/core';
import { NotificationsService } from '../services/notifications.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(
    private notificationsService: NotificationsService,
  ) { }

}
