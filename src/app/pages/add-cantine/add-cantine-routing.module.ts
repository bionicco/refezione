import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddCantinePage } from './add-cantine.page';

const routes: Routes = [
  {
    path: '',
    component: AddCantinePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddCantinePageRoutingModule {}
