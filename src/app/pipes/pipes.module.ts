import { NgModule } from '@angular/core';
import { MyDatePipe } from './my-date.pipe';

@NgModule({
  exports: [
    MyDatePipe
  ],
  declarations: [MyDatePipe]
})
export class PipeModule { }
