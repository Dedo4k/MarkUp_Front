import {Injectable} from '@angular/core';
import {Annotation, Layout} from "../models/layout/annotation";
import {Builder, parseString} from "xml2js";
import {parseBooleans, parseNumbers} from "xml2js/lib/processors";

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() {
  }

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
          explicitArray: false, valueProcessors: [
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

  buildXml(layout: Layout) {
    return new Builder({rootName: "annotation"}).buildObject(layout);
  }
}
