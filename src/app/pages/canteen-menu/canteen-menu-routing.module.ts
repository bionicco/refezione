import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CanteenMenuPage } from './canteen-menu.page';

const routes: Routes = [
  {
    path: '',
    component: CanteenMenuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CanteenMenuPageRoutingModule {}
