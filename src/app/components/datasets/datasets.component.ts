import {Component} from '@angular/core';
import {DatasetService} from "../../services/dataset.service";
import {Dataset} from "../../models/dataset";
import {AuthService} from "../../services/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {DatasetSelectComponent} from "./dataset-select/dataset-select.component";
import {DatasetUploaderService} from "../../services/dataset-uploader.service";

@Component({
  selector: 'app-datasets',
  templateUrl: './datasets.component.html',
  styleUrls: ['./datasets.component.sass']
})
export class DatasetsComponent {

  datasets: Dataset[] = [];

  constructor(private datasetService: DatasetService,
              private authService: AuthService,
              private dialog: MatDialog,
              public datasetUploader: DatasetUploaderService) {
    authService.auth('/datasets', undefined);
  }

  get auth(): AuthService {
    return this.authService;
  }

  openLoadExistingDialog() {
    this.datasetService.getLoadedDatasets().subscribe(res => {
      let datasetSelectDialog = this.dialog.open(DatasetSelectComponent, {data: res});

      datasetSelectDialog.afterClosed().subscribe(result => {
        if (result && result.datasets?.length) {
          this.datasetService.loadDatasets(result.datasets)
            .subscribe(res => {
              this.datasets = res;
              this.auth.authenticated.datasets = res;
              localStorage.setItem("currentUser", JSON.stringify(this.auth.authenticated))
            });
        }
      });
    });
  }

  handleFileSelect(event: Event) {
    let files = (event.target as HTMLInputElement).files;
    if (files && files.length) {
      this.datasetUploader.uploadDataset(files);
    }
  }

  countDatasetTime(dataset: Dataset) {
    let datasetStatistics = dataset.datasetStatistics.filter(dataset => this.auth.authenticated.moderators
      .some(m => m.id === dataset.userId) || this.auth.authenticated.id === dataset.userId);
    if (!datasetStatistics.length) {
      return 0;
    }
    return datasetStatistics
      .map(dataset => dataset.moderatingTime).reduce((a, b) => a + b);
  }
}
