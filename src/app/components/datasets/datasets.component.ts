import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DatasetService} from "../../services/dataset.service";
import {Dataset} from "../../models/dataset";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-datasets',
  templateUrl: './datasets.component.html',
  styleUrls: ['./datasets.component.sass']
})
export class DatasetsComponent implements OnInit, AfterViewInit {

  datasets: Dataset[] = [];

  constructor(private datasetService: DatasetService,
              private authService: AuthService,
              private router: Router) {
    if (!authService.isAuthenticated()) {
      authService.openLoginDialog('/datasets');
    }
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.datasetService.getLoadedDatasets()
      .subscribe(result => this.datasets = result);
  }

  getAvailableDatasets(): void {
    this.datasetService.getAvailableDatasets()
      .subscribe(result => console.log(result));
  }

  get auth(): AuthService {
    return this.authService;
  }
}
