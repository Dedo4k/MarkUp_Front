import {Injectable} from '@angular/core';
import {Annotation} from "../models/layout/annotation";
import {parseString} from "xml2js";
import {parseBooleans, parseNumbers} from "xml2js/lib/processors";

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

  parseData(layout: string, type: string) {
    let annotation = {} as Annotation;
    switch (type) {
      case "xml": {
        let json: any;
        parseString(layout, {
          explicitArray: false, mergeAttrs: true, valueProcessors: [
            parseNumbers,
            parseBooleans
          ]
        }, (err, result) => {
          json = result;
        });

        annotation = json.annotation as Annotation;
        break;
      }
      case "json": {

        break;
      }
    }
    return annotation;
  }
}
