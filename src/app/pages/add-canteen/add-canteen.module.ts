import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddCanteenPageRoutingModule } from './add-canteen-routing.module';

import { AddCanteenPage } from './add-canteen.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddCanteenPageRoutingModule
  ],
  declarations: [AddCanteenPage]
})
export class AddCanteenPageModule { }
