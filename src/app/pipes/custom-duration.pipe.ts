import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import 'moment-duration-format';

@Pipe({
  name: 'customDuration'
})
export class CustomDurationPipe implements PipeTransform {

  transform(value: string | number | null | undefined): string | null {
    return moment.duration(value, "milliseconds").format(customTemplate(value), {trim: false});
  }
}

function customTemplate(value: string | number | null | undefined) {
  return moment.duration(value, "milliseconds").asSeconds() >= 86400 ? "d [days] hh:mm:ss" : "hh:mm:ss";
}
