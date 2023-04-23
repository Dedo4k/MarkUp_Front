import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {ActivatedRoute} from "@angular/router";
import {DatasetStorageService} from "../../../services/dataset-storage.service";
import {MatSelectionList} from "@angular/material/list";
import {Observable, of} from "rxjs";
import Konva from "konva";

@Component({
  selector: 'app-dataset-details',
  templateUrl: './dataset-details.component.html',
  styleUrls: ['./dataset-details.component.sass']
})
export class DatasetDetailsComponent implements AfterViewInit {

  public configStage: Observable<any> = of({
    width: 200,
    height: 200
  });

  name: string = '';
  storage: DatasetStorageService;

  selectedName = "";

  @ViewChild("matList")
  list: MatSelectionList | undefined;

  @ViewChild("stage")
  stage: Konva.Stage | undefined;

  @ViewChild("imgLayer")
  imgLayer: Konva.Layer | undefined;

  @ViewChild("imgLayer")
  layer: HTMLElement | undefined;

  @ViewChild("layoutLayer")
  layoutLayer: Konva.Layer | undefined;

  stage1: Konva.Stage | undefined;

  layer1: Konva.Layer | undefined;

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
        this.storage.downloadDataset(this.name, undefined);
      }
    });
  }

  ngAfterViewInit(): void {
    console.log(this.storage.dataset.length);
  }

  current() {
    var data = this.storage.current();
    this.selectedName = data?.dataName;
    return data;
  }

  next() {
    this.storage.next(undefined);
    let rect = new Konva.Rect({
      x: 20,
      y: 20,
      width: 100,
      height: 50,
      stroke: 'black',
      strokeWidth: 1
    });

    this.stage1 = new Konva.Stage({
      container: "img-container",
      width: window.innerWidth,
      height: window.innerHeight
    });

    this.layer1 = new Konva.Layer();

    this.stage1.add(this.layer1);
    this.layer1.add(rect);

    let image = new Image();
    let imgLayer1 = this.layer1;
    image.onload = function () {
      let image1 = new Konva.Image({
        x: 0,
        y: 0,
        image: image,
        width: image.width,
        height: image.height
      });
      imgLayer1?.add(image1);
    }
    // console.log("data:image/jpeg;base64," + this.current().imageBytes);
    image.src = "data:image/jpeg;base64," + this.current().imageBytes;
  }

  prev() {
    this.storage.prev(undefined);
  }
}
