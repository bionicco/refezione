import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddCantinePageRoutingModule } from './add-cantine-routing.module';

import { AddCantinePage } from './add-cantine.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddCantinePageRoutingModule
  ],
  declarations: [AddCantinePage]
})
export class AddCantinePageModule {}
