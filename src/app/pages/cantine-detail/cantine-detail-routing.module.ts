import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CantineDetailPage } from './cantine-detail.page';

const routes: Routes = [
  {
    path: '',
    component: CantineDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CantineDetailPageRoutingModule {}
