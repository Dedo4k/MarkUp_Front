import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Dataset} from "../models/dataset";
import {Observable} from "rxjs";
import {AuthService} from "./auth.service";
import {Data} from "../models/data";


@Injectable({
  providedIn: 'root'
})
export class DatasetService {

  private apiUrl = "/api/v2/datasets";

  constructor(private http: HttpClient,
              private authService: AuthService) {
  }

  getLoadedDatasets(): Observable<Dataset[]> {
    return this.http.get<Dataset[]>(this.apiUrl, this.authService.options);
  }

  getAvailableDatasets(): Observable<Dataset[]> {
    return this.http.get<Dataset[]>(this.apiUrl + "/available", this.authService.options);
  }

  getDatasetNames(datasetName: string): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl + "/" + datasetName + "/names", this.authService.options);
  }

  getDataFromDataset(datasetName: string, dataName: string): Observable<Data> {
    return this.http.get<Data>(this.apiUrl + "/" + datasetName + "/" + dataName, this.authService.options);
  }
}
