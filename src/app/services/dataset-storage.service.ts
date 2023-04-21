import {Injectable} from '@angular/core';
import {Data} from "../models/data";
import {DatasetService} from "./dataset.service";

enum Shift {
  None,
  Left,
  Right
}

@Injectable({
  providedIn: 'root'
})
export class DatasetStorageService {

  datasetName = "";
  dataset: Data[] = [];
  names: string[] = [];
  colors = new Map([["default", "black"]]);
  maxSize = 20;
  cursor = 0;
  downloading = false;

  constructor(private datasetService: DatasetService) {
  }

  downloadDataset(datasetName: string) {
    this.dataset = [];
    this.names = [];
    this.datasetName = datasetName;

    this.datasetService.getDatasetNames(datasetName)
      .subscribe(result => {
        this.names = result;
        this.fillDatasetBuffer(Shift.None)
      });
  }

  private fillDatasetBuffer(shift: Shift) {
    console.log(this.dataset, this.cursor);
    if (this.dataset.length <= this.maxSize) {
      this.downloading = true;
      this.datasetService.getDataFromDataset(this.datasetName, this.names[this.dataset.length]).subscribe(res => {
        this.downloading = false;
        this.dataset.push(res);
        // TODO add here fraw function
        this.fillDatasetBuffer(Shift.None);
      });
    } else {
      this.downloading = true;
      this.datasetService.getDataFromDataset(this.datasetName, this.names[this.cursor + (shift == Shift.Left ? -this.maxSize / 2 : shift == Shift.Right ? this.maxSize / 2 : 0)]).subscribe(res => {
        this.downloading = false;
        if (shift == Shift.Right) {
          this.dataset.push(res);
          this.dataset.shift();
        } else if (shift == Shift.Left) {
          this.dataset.unshift(res);
          this.dataset.pop();
        }
      });
    }
  }

  current() {
    let number = this.cursor > this.maxSize / 2 ? this.maxSize / 2 : this.cursor;
    console.log(number, this.dataset);
    return this.dataset[number];
  }

  next() {
    //TODO попробовать сначала загрузить новый файл а потом только сдвишать указатель
    if (this.cursor < this.names.length) {
      this.cursor++;
    }
    if (this.cursor > this.maxSize / 2) {
      setTimeout(() => this.fillDatasetBuffer(Shift.Right));
    }
  }

  prev() {
    if (0 < this.cursor) {
      this.cursor--;
    }
    if (this.cursor >= this.maxSize / 2) {
      setTimeout(() => this.fillDatasetBuffer(Shift.Left));
    }
  }

  getLabels() {
    return Array.from(new Set(this.current().layout.object.map(obj => obj.name)));
  }

  getColor(label: string) {
    if (!this.colors.has(label)) {
      let color = Math.floor(Math.random() * 16777216).toString(16);
      while (color.length < 6) {
        color = 0 + color;
      }
      this.colors.set(label, "#" + color);
    }
    return this.colors.get(label);
  }

  updateData(data: Data) {
    this.datasetService.updateData(data).subscribe(result => {
      console.log(result);
    });
  }
}
