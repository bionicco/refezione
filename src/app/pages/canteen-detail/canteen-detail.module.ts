import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CanteenDetailPageRoutingModule } from './canteen-detail-routing.module';

import { CanteenDetailPage } from './canteen-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CanteenDetailPageRoutingModule
  ],
  declarations: [CanteenDetailPage]
})
export class CanteenDetailPageModule { }
