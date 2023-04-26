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
  maxSize = 20;
  cursor = 0;
  bufferCursor = 0;
  downloading = false;
  downloadingReset = false;

  constructor(private datasetService: DatasetService) {
  }

  downloadDataset(datasetName: string, callback: Function | undefined) {
    let timeout = 0;
    if (this.downloading) {
      this.downloadingReset = true;
      timeout = 250;
    }
    setTimeout(() => {
      this.dataset = [];
      this.names = [];
      this.datasetName = datasetName;
      this.cursor = 0;
      this.bufferCursor = 0;
      this.downloadingReset = false;
      this.datasetService.getDatasetNames(datasetName)
        .subscribe(result => {
          this.names = result;
          this.fillDatasetBuffer(0, callback);
        });
    }, timeout);
  }

  private fillDatasetBuffer(bufferPosition: number, callback: Function | undefined) {
    // console.log(this.dataset);

    if (this.downloadingReset) {
      this.downloadingReset = false;
      return;
    }

    if (bufferPosition == this.cursor && this.dataset.length > 0) {
      if (this.cursor < this.maxSize / 2) {
        if (this.dataset.length - this.bufferCursor < this.maxSize - this.cursor) {
          this.downloadAndAddRight();
        } else if (this.bufferCursor < this.cursor) {
          this.downloadAndAddLeft();
        }
      } else if (this.cursor >= this.names.length - this.maxSize / 2) {
        if (this.dataset.length - this.bufferCursor < this.names.length - this.cursor) {
          this.downloadAndAddRight();
        } else if (this.bufferCursor < this.maxSize - this.names.length + this.cursor) {
          this.downloadAndAddLeft();
        }
      } else {
        if (this.dataset.length - this.bufferCursor < this.maxSize / 2) {
          this.downloadAndAddRight();
        } else if (this.bufferCursor < this.maxSize / 2) {
          this.downloadAndAddLeft();
        }
      }
    } else if (bufferPosition < this.cursor && bufferPosition >= this.cursor - this.bufferCursor) {
      while (this.cursor != bufferPosition) {
        this.dataset.pop();
        this.bufferCursor--;
        this.cursor--;
      }
      if (callback) {
        callback();
      }
      this.fillDatasetBuffer(bufferPosition, undefined);
    } else if (bufferPosition > this.cursor && bufferPosition < this.cursor + this.dataset.length - this.bufferCursor) {
      while (this.cursor != bufferPosition) {
        this.dataset.shift();
        this.cursor++;
      }
      if (callback) {
        callback();
      }
      this.fillDatasetBuffer(bufferPosition, undefined);
    } else {
      this.dataset = [];
      this.bufferCursor = 0;
      this.cursor = bufferPosition;
      this.downloading = true;
      this.datasetService.getDataFromDataset(this.datasetName, this.names[this.cursor])
        .subscribe(res => {
          this.downloading = false;
          this.dataset.push(res);
          if (callback) {
            callback();
          }
          this.fillDatasetBuffer(bufferPosition, callback);
        })
    }
  }

  current() {
    return this.dataset[this.bufferCursor];
  }

  next(callback: Function | undefined) {
    let timeout = 0;
    if (this.cursor < this.names.length) {
      if (this.downloading) {
        this.downloadingReset = true;
        timeout = 300;
      }
      setTimeout(() => {
        this.downloadingReset = false;
        this.fillDatasetBuffer(this.cursor + 1, callback);
      }, timeout);
    }
  }

  prev(callback: Function | undefined) {
    let timeout = 0;
    if (this.cursor > 0) {
      if (this.downloading) {
        this.downloadingReset = true;
        timeout = 300;
      }
      setTimeout(() => {
        this.downloadingReset = false;
        this.fillDatasetBuffer(this.cursor - 1, callback);
      }, timeout);
    }
  }

  getLabels() {
    return Array.from(new Set(this.current().layout.object.map(obj => obj.name)));
  }

  updateData(data: Data) {
    this.datasetService.updateData(data).subscribe(result => {
      // console.log(result);
    });
  }

  goToData(dataName: string, callback: Function | undefined) {
    let timeout = 0;
    if (this.downloading) {
      this.downloadingReset = true;
      timeout = 250;
    }
    setTimeout(() => {
      let nameIndex = this.names.indexOf(dataName);
      if (nameIndex >= 0) {
        this.downloadingReset = false;
        this.fillDatasetBuffer(nameIndex, callback);
      }
    }, timeout);
  }

  private downloadAndAddLeft() {
    this.downloading = true;
    this.datasetService.getDataFromDataset(this.datasetName, this.names[this.cursor - this.bufferCursor - 1])
      .subscribe(res => {
        this.downloading = false;
        this.dataset.unshift(res);
        this.bufferCursor++;
        this.fillDatasetBuffer(this.cursor, undefined);
      })
  }

  private downloadAndAddRight() {
    this.downloading = true;
    this.datasetService.getDataFromDataset(this.datasetName, this.names[this.cursor + this.dataset.length - this.bufferCursor])
      .subscribe(res => {
        this.downloading = false;
        this.dataset.push(res);
        this.fillDatasetBuffer(this.cursor, undefined);
      })
  }
}
