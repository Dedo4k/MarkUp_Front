import {Component, ViewChild} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {ActivatedRoute} from "@angular/router";
import {DatasetStorageService} from "../../../services/dataset-storage.service";
import {MatProgressBar} from "@angular/material/progress-bar";

@Component({
  selector: 'app-dataset-details',
  templateUrl: './dataset-details.component.html',
  styleUrls: ['./dataset-details.component.sass']
})
export class DatasetDetailsComponent {

  name: string = '';
  storage: DatasetStorageService;

  constructor(private authService: AuthService,
              private route: ActivatedRoute,
              public datasetStorage: DatasetStorageService) {
    if (!authService.isAuthenticated()) {
      authService.openLoginDialog('/datasets');
    }
    this.storage = datasetStorage;
    route.paramMap.subscribe(params => {
      let name = params.get("name");
      if (name != null) {
        this.name = name;
        this.storage.downloadDataset(this.name);
      }
    });
  }
}
