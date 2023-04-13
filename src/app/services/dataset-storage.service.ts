import {ChangeDetectorRef, Injectable} from '@angular/core';
import {Data} from "../models/data";
import {DatasetService} from "./dataset.service";
import {delay, timeout} from "rxjs";

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
    if (this.dataset.length <= this.maxSize) {
      this.downloading = true;
      this.datasetService.getDataFromDataset(this.datasetName, this.names[this.dataset.length]).subscribe(res => {
        this.downloading = false;
        this.dataset.push(res);
        this.fillDatasetBuffer(Shift.None);
      });
    } else {
      this.downloading = true;
      this.datasetService.getDataFromDataset(this.datasetName, this.names[this.cursor + (shift == Shift.Left ? -this.maxSize / 2 : shift == Shift.Right ? this.maxSize / 2 : 0)]).subscribe(res => {
        this.downloading = false;
        if (shift == Shift.Right) {
          this.dataset.shift();
          this.dataset.push(res);
        } else if (shift == Shift.Left) {
          this.dataset.unshift(res);
        }
      });
    }
  }

  current() {
    return this.dataset[this.cursor > this.maxSize / 2 ? this.maxSize / 2 : this.cursor];
  }

  next() {
    if (this.cursor < this.names.length) {
      this.cursor++;
    }
    if (this.cursor > this.maxSize / 2) {
      this.fillDatasetBuffer(Shift.Right);
    }
  }

  prev() {
    if (0 < this.cursor) {
      this.cursor--;
    }
    if (this.cursor >= this.maxSize / 2) {
      this.fillDatasetBuffer(Shift.Left);
    }
  }
}
