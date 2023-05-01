import {Component} from '@angular/core';
import {DatasetService} from "../../services/dataset.service";
import {Dataset} from "../../models/dataset";
import {AuthService} from "../../services/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {DatasetSelectComponent} from "./dataset-select/dataset-select.component";

@Component({
  selector: 'app-datasets',
  templateUrl: './datasets.component.html',
  styleUrls: ['./datasets.component.sass']
})
export class DatasetsComponent {

  datasets: Dataset[] = [];

  constructor(private datasetService: DatasetService,
              private authService: AuthService,
              private dialog: MatDialog) {
    authService.auth('/datasets', undefined);
  }

  get auth(): AuthService {
    return this.authService;
  }

  openLoadExistingDialog() {
    this.datasetService.getLoadedDatasets().subscribe(res => {
      let datasetSelectDialog = this.dialog.open(DatasetSelectComponent, {data: res});

      datasetSelectDialog.afterClosed().subscribe(result => {
        if (result.datasets?.length) {
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
    // @ts-ignore
    console.log(event.target.files);
  }
}
