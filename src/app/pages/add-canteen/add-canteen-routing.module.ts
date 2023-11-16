import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddCanteenPage } from './add-canteen.page';


const routes: Routes = [
  {
    path: '',
    component: AddCanteenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddCanteenPageRoutingModule { }
