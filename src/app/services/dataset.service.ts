import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Dataset} from "../models/dataset";
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class DatasetService {

  constructor(private http: HttpClient) {
  }

  getLoadedDatasets(): Observable<Dataset[]> {
    return this.http.get<Dataset[]>("/api/v2/datasets");
  }

  getAvailableDatasets(): Observable<Dataset[]> {
    return this.http.get<Dataset[]>("/api/v2/datasets/available");
  }
}
