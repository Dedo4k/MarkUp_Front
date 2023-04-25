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
  bufferCursor = 0;
  downloading = false;
  downloadingReset = false;

  constructor(private datasetService: DatasetService) {
  }

  downloadDataset(datasetName: string, callback: Function | undefined) {
    this.dataset = [];
    this.names = [];
    this.datasetName = datasetName;
    this.cursor = 0;
    this.bufferCursor = 0;

    this.datasetService.getDatasetNames(datasetName)
      .subscribe(result => {
        this.names = result;
        this.fillDatasetBuffer(0, callback);
      });
  }

  private fillDatasetBuffer(bufferPosition: number, callback: Function | undefined) {
    // console.log("============")
    // this.dataset.forEach(value => console.log(value.dataName));
    // console.log("============")

    console.log(this.dataset);

    // if (this.dataset.length <= this.maxSize) {
    //   this.downloading = true;
    //   this.datasetService.getDataFromDataset(this.datasetName, this.names[this.dataset.length]).subscribe(res => {
    //     this.downloading = false;
    //     this.dataset.push(res);
    //     if (callback) {
    //       callback();
    //     }
    //     this.fillDatasetBuffer(Shift.None, undefined);
    //   });
    // } else {
    //   this.downloading = true;
    //   this.datasetService.getDataFromDataset(this.datasetName, this.names[this.cursor + (shift == Shift.Left ? -this.maxSize / 2 : shift == Shift.Right ? this.maxSize / 2 : 0)]).subscribe(res => {
    //     this.downloading = false;
    //     if (shift == Shift.Right) {
    //       this.dataset.push(res);
    //       this.dataset.shift();
    //       this.bufferCursor--;
    //     } else if (shift == Shift.Left) {
    //       this.dataset.unshift(res);
    //       this.bufferCursor++;
    //       this.dataset.pop();
    //     }
    //   });
    //   if (callback) {
    //     callback();
    //   }
    // }

    // if (bufferPosition < this.cursor + this.maxSize - this.bufferCursor
    //   && bufferPosition > this.cursor - this.bufferCursor
    //   && this.dataset.length > 0) { //если буфер не пуст и содержит нужное значение
    //   let bufferShift = bufferPosition - this.cursor;
    //   if (bufferShift < 0) {//если сдвиг влево
    //     if (this.cursor - this.bufferCursor == 0) {//если упёрлись в начало фйалов
    //
    //     } else {
    //
    //     }
    //   } else if (bufferShift > 0) {//если сдвиг вправо
    //     if (this.cursor + this.maxSize - this.bufferCursor == this.names.length) {//если уперлись в конец файлов
    //
    //     } else {
    //
    //     }
    //   } else if (bufferShift == 0 && this.dataset.length < this.maxSize) {//если сдвига нет, но буфер не заполнен
    //
    //   }
    // } else {//если значения нет в буфере
    //
    // }

    // if (bufferPosition == this.cursor) {
    //   if (this.dataset.length == 0) {
    //     this.downloading = true;
    //     this.datasetService.getDataFromDataset(this.datasetName, this.names[this.cursor])
    //       .subscribe(res => {
    //         this.downloading = false;
    //         this.dataset.push(res);
    //         if (callback) {
    //           callback();
    //         }
    //         this.fillDatasetBuffer(bufferPosition, undefined);
    //       });
    //   } else {
    //     if (this.cursor < this.maxSize / 2) {
    //       this.datasetService.getDataFromDataset(this.datasetName, this.names[this.cursor + this.dataset.length])
    //         .subscribe()
    //     } else if (this.cursor >= this.names.length - this.maxSize / 2) {
    //
    //     } else {
    //
    //     }
    //   }
    // } else if (bufferPosition - this.maxSize / 2 < this.cursor - this.bufferCursor
    //   && bufferPosition + this.maxSize / 2 > this.cursor - this.bufferCursor) {//shift left
    //
    // } else if (bufferPosition - this.maxSize / 2 < this.cursor - this.bufferCursor + this.maxSize
    //   && bufferPosition + this.maxSize / 2 > this.cursor - this.bufferCursor + this.maxSize) {//shift right
    //
    // }

    // if (this.downloadingReset) {
    //   return;
    // }
    //
    // if (bufferPosition !== this.cursor) {
    //   this.cursor = bufferPosition;
    //   this.bufferCursor = 0;
    //   this.dataset = [];
    // }
    //
    // if (this.cursor < this.maxSize / 2) {
    //   if (this.dataset.length - this.bufferCursor < this.maxSize - this.cursor) {
    //     this.downloading = true;
    //     this.datasetService.getDataFromDataset(this.datasetName, this.names[this.cursor + this.dataset.length])
    //       .subscribe(res => {
    //         this.downloading = false;
    //         this.dataset.push(res);
    //         if (callback) {
    //           callback();
    //         }
    //         this.fillDatasetBuffer(bufferPosition, undefined);
    //       })
    //   } else if (this.bufferCursor < this.cursor) {
    //     this.downloading = true;
    //     this.datasetService.getDataFromDataset(this.datasetName, this.names[this.cursor - this.bufferCursor - 1])
    //       .subscribe(res => {
    //         this.downloading = false;
    //         this.dataset.unshift(res);
    //         this.bufferCursor++;
    //         if (callback) {
    //           callback();
    //         }
    //         this.fillDatasetBuffer(bufferPosition, undefined);
    //       })
    //   }
    // } else if (this.cursor >= this.names.length - this.maxSize / 2) {
    //   if (this.dataset.length - this.bufferCursor < this.names.length - this.cursor) {
    //     this.downloading = true;
    //     this.datasetService.getDataFromDataset(this.datasetName, this.names[this.cursor + this.dataset.length])
    //       .subscribe(res => {
    //         this.downloading = false;
    //         this.dataset.push(res);
    //         if (callback) {
    //           callback();
    //         }
    //         this.fillDatasetBuffer(bufferPosition, undefined);
    //       })
    //   } else if (this.bufferCursor < this.maxSize - this.names.length + this.cursor) {
    //     this.downloading = true;
    //     this.datasetService.getDataFromDataset(this.datasetName, this.names[this.cursor - this.bufferCursor - 1])
    //       .subscribe(res => {
    //         this.downloading = false;
    //         this.dataset.unshift(res);
    //         this.bufferCursor++;
    //         if (callback) {
    //           callback();
    //         }
    //         this.fillDatasetBuffer(bufferPosition, undefined);
    //       })
    //   }
    // } else {
    //   if (this.dataset.length - this.bufferCursor < this.maxSize / 2) {
    //     this.downloading = true;
    //     this.datasetService.getDataFromDataset(this.datasetName, this.names[this.cursor + this.dataset.length])
    //       .subscribe(res => {
    //         this.downloading = false;
    //         this.dataset.push(res);
    //         if (callback) {
    //           callback();
    //         }
    //         this.fillDatasetBuffer(bufferPosition, undefined);
    //       })
    //   } else if (this.bufferCursor < this.maxSize / 2) {
    //     this.downloading = true;
    //     this.datasetService.getDataFromDataset(this.datasetName, this.names[this.cursor - this.bufferCursor - 1])
    //       .subscribe(res => {
    //         this.downloading = false;
    //         this.dataset.unshift(res);
    //         this.bufferCursor++;
    //         if (callback) {
    //           callback();
    //         }
    //         this.fillDatasetBuffer(bufferPosition, undefined);
    //       })
    //   }
    // }

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

    // if (rightElements < this.maxSize / 2) {
    //   console.log("a")
    //   this.downloading = true;
    //   this.datasetService.getDataFromDataset(this.datasetName, this.names[this.cursor + rightElements])
    //     .subscribe(res => {
    //       this.downloading = false;
    //       this.dataset.push(res);
    //       if (callback) {
    //         callback();
    //       }
    //       this.fillDatasetBuffer(bufferPosition, undefined);
    //     });
    // } else if (this.bufferCursor < this.maxSize / 2) {
    //   console.log("b")
    //   this.downloading = true;
    //   this.datasetService.getDataFromDataset(this.datasetName, this.names[this.cursor - this.bufferCursor])
    //     .subscribe(res => {
    //       this.downloading = false;
    //       this.dataset.unshift(res);
    //       this.bufferCursor++;
    //       if (callback) {
    //         callback();
    //       }
    //       this.fillDatasetBuffer(bufferPosition, undefined);
    //     })
    // }
  }

  current() {
    return this.dataset[this.bufferCursor];
  }

  next(callback: Function | undefined) {
    //TODO попробовать сначала загрузить новый файл а потом только сдвишать указатель
    // if (this.cursor < this.names.length) {
    //   this.cursor++;
    // }
    // if (this.bufferCursor < this.maxSize) {
    //   this.bufferCursor++;
    // }
    // if (this.bufferCursor > this.maxSize / 2) {
    //   this.fillDatasetBuffer(Shift.Right, callback);
    // } else {
    //   if (callback) {
    //     callback();
    //   }
    // }
    if (this.cursor < this.names.length) {
      this.downloadingReset = true;

      setTimeout(() => {
        this.downloadingReset = false;
        this.fillDatasetBuffer(this.cursor + 1, callback);
      }, 300);
    }
  }

  prev(callback: Function | undefined) {
    // if (0 < this.cursor) {
    //   this.cursor--;
    // }
    // if (0 < this.bufferCursor) {
    //   this.bufferCursor--;
    // }
    // if (this.cursor >= this.maxSize / 2) {
    //   this.fillDatasetBuffer(Shift.Left, callback);
    // } else {
    //   if (callback) {
    //     callback();
    //   }
    // }
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
