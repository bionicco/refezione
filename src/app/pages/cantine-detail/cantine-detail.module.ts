import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CantineDetailPageRoutingModule } from './cantine-detail-routing.module';

import { CantineDetailPage } from './cantine-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CantineDetailPageRoutingModule
  ],
  declarations: [CantineDetailPage]
})
export class CantineDetailPageModule {}
