import { Injectable } from '@angular/core';
import {DatasetService} from "./dataset.service";

@Injectable({
  providedIn: 'root'
})
export class DatasetUploaderService {

  datasetName: string | undefined;
  files: FileList | undefined;
  uploading = false;
  uploaded = 0;

  constructor(private datasetService: DatasetService) { }

  uploadDataset(files: FileList) {
    this.uploaded = 0;
    this.files = files;
    this.datasetName = this.files[0].webkitRelativePath.split("/")[0];
    for (let i = 0; i < this.files.length; i++) {
      this.uploading = true;
      this.datasetService.uploadDataset(this.datasetName, this.files.item(i)!)
        .subscribe(res => {
          this.uploading = false;
          this.uploaded++;
        });
    }
  }
}
