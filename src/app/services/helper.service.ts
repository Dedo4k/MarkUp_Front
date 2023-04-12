import { Injectable } from '@angular/core';
import {isEmpty} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  isEmpty(object: Object): boolean {
    return Object.values(object).every(x => x === null);
  }

  isNotEmpty(object: Object): boolean {
    return !this.isEmpty(object);
  }
}
