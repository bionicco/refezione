import { Pipe, PipeTransform } from '@angular/core';
import { format, formatDistance } from 'date-fns';
import { startOfDay } from 'date-fns';
import { isToday, isTomorrow, isYesterday } from 'date-fns';
import { it } from 'date-fns/locale';

@Pipe({
  name: 'myDate'
})
export class MyDatePipe implements PipeTransform {

  transform(value: Date, ...args: unknown[]): unknown {
    if (value) {
      const dateFormat = format(value, 'dd/MM/yyyy EEEE', { locale: it });
      if (isToday(value)) return `${dateFormat} oggi`;
      if (isTomorrow(value)) return `${dateFormat} domani`;
      if (isYesterday(value)) return `${dateFormat} ieri`;
      return `${dateFormat} (${formatDistance(value, startOfDay(new Date()), { locale: it })})`;
    }
    return null;
  }

}
