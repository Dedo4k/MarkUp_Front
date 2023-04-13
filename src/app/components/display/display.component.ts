import {Component, OnInit} from '@angular/core';
import Konva from "konva";
import {DatasetStorageService} from "../../services/dataset-storage.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.sass']
})
export class DisplayComponent implements OnInit {

  stage: Konva.Stage | undefined;
  imageLayer: Konva.Layer | undefined;
  layoutLayer: Konva.Layer | undefined;

  constructor(public storage: DatasetStorageService,
              private route: ActivatedRoute) {
    route.paramMap.subscribe(params => {
      let name = params.get("name");
      if (name != null) {
        storage.downloadDataset(name);
      }
    })
  }

  ngOnInit(): void {
    this.stage = new Konva.Stage({
      container: "img-container",
      width: window.innerWidth,
      height: window.innerHeight
    });
    this.imageLayer = new Konva.Layer();
    this.layoutLayer = new Konva.Layer();
    this.stage.add(this.imageLayer);
    this.stage.add(this.layoutLayer);

    new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.storage.dataset.length > 0) {
          resolve(this.storage.dataset.length);
        }
      }, 500);
    }).then((res) => {
      this.displayFirstData()
    })
  }

  displayFirstData() {
    let image = new Image();
    image.onload = () => {
      let dataImage = new Konva.Image({
        x: 0,
        y: 0,
        image: image,
        width: image.width,
        height: image.height
      });
      this.stage?.setSize({width: image.width, height: image.height});
      this.imageLayer?.add(dataImage);
    }
    image.src = "data:image/jpeg;base64," + this.storage.current().imageBytes;
  }
}
