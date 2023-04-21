import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Dataset} from "../models/dataset";
import {map, Observable} from "rxjs";
import {AuthService} from "./auth.service";
import {Data, DataDto} from "../models/data";
import {HelperService} from "./helper.service";
import {Layout} from "../models/layout/annotation";


@Injectable({
  providedIn: 'root'
})
export class DatasetService {

  private apiUrl = "/api/v2/datasets";

  constructor(private http: HttpClient,
              private authService: AuthService,
              private helper: HelperService) {
  }

  getLoadedDatasets(): Observable<Dataset[]> {
    return this.http.get<Dataset[]>(this.apiUrl, this.authService.options);
  }

  getDatasetNames(datasetName: string): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl + "/" + datasetName + "/names", this.authService.options);
  }

  getDataFromDataset(datasetName: string, dataName: string): Observable<Data> {
    return this.http.get<DataDto>(this.apiUrl + "/" + datasetName + "/" + dataName, this.authService.options)
      .pipe(map((dto) => {
          let data = dto as unknown as Data;
          let annotation = this.helper.parseData(dto.layout, dto.layoutType);
          if (annotation.object.constructor === Array) {
            data.layout = annotation as Layout;
          } else {
            let layout = annotation as Layout;
            // @ts-ignore
            layout.object = [annotation.object];
            data.layout = layout;
          }
          return data;
        }
      ));
  }

  updateData(data: Data): Observable<Data> {
    let buildFile = this.helper.buildXml(data.layout);
    let blob = new Blob([buildFile], {type: "text/xml"});
    let file = new File([blob], data.layoutName);
    let formData = new FormData();
    formData.append("file", file);

    return this.http.post<Data>(this.apiUrl + "/" + data.datasetName + "/" + data.dataName, formData,
      this.authService.options);
  }
}
