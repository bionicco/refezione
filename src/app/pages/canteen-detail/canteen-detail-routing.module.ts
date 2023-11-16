import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CanteenDetailPage } from './canteen-detail.page';

const routes: Routes = [
  {
    path: '',
    component: CanteenDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CanteenDetailPageRoutingModule { }
