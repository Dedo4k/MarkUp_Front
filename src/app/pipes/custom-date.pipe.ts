import {Pipe, PipeTransform} from '@angular/core';
import {DatePipe} from "@angular/common";

@Pipe({
  name: 'customDate'
})
export class CustomDatePipe implements PipeTransform {

  DATE_TIME_FORMAT = "dd.MM.YYYY HH:mm:ss";
  DATE_FORMAT = "dd.MM.YYYY";
  TIME_FORMAT = "HH:mm:ss";

  formats = new Map([
    ["date-time", this.DATE_TIME_FORMAT],
    ["date", this.DATE_FORMAT],
    ["time", this.TIME_FORMAT]
  ]);

  transform(value: Date | string | number | null | undefined,
            format = "date-time"): string | null {
    return new DatePipe("en-US").transform(value, this.formats.get(format));
  }
}
