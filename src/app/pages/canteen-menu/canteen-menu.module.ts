import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CanteenMenuPageRoutingModule } from './canteen-menu-routing.module';

import { CanteenMenuPage } from './canteen-menu.page';
import { DateFnsModule } from 'ngx-date-fns';
import { PipeModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CanteenMenuPageRoutingModule,
    DateFnsModule,
    PipeModule],
  declarations: [CanteenMenuPage]
})
export class CanteenMenuPageModule { }
