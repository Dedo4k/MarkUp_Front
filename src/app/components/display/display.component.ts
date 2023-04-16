import {Component, OnInit} from '@angular/core';
import Konva from "konva";
import {DatasetStorageService} from "../../services/dataset-storage.service";
import {ActivatedRoute} from "@angular/router";
import {Annotation, Bndbox} from "../../models/layout/annotation";
import {parseString} from "xml2js";
import {parseBooleans, parseNumbers} from "xml2js/lib/processors";

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.sass']
})
export class DisplayComponent implements OnInit {

  stage: Konva.Stage | undefined;
  imageLayer: Konva.Layer | undefined;
  layoutLayer: Konva.Layer | undefined;
  layoutTransformer: Konva.Transformer | undefined;
  x1: number | undefined;
  x2: number | undefined;
  y1: number | undefined;
  y2: number | undefined;
  drawingRect: Konva.Rect | undefined;

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

    this.stage.on("mousedown touchstart", (e) => {

      this.x1 = Number(this.stage?.getPointerPosition()?.x);
      this.y1 = Number(this.stage?.getPointerPosition()?.y);
      this.x2 = Number(this.x1);
      this.y2 = Number(this.y1);

      this.drawingRect = new Konva.Rect({
        x: this.x1,
        y: this.y1,
        width: 0,
        height: 0,
        strokeWidth: 2,
        stroke: "black"
      });
      console.log(this.drawingRect);
      this.layoutLayer?.add(this.drawingRect);
    });

    this.stage.on("mousemove touchmove", (e) => {
      this.x2 = this.stage?.getPointerPosition()?.x;
      this.y2 = this.stage?.getPointerPosition()?.y;

      this.drawingRect?.setAttrs({
        x: Math.min(Number(this.x1), Number(this.x2)),
        y: Math.min(Number(this.y1), Number(this.y2)),
        width: Math.abs(Number(this.x1) - Number(this.x2)),
        height: Math.abs(Number(this.y1) - Number(this.y2))
      });
    });

    this.stage.on("mouseup touchend", (e) => {
      let rect = new Konva.Rect({
        x: this.drawingRect?.x(),
        y: this.drawingRect?.y(),
        width: this.drawingRect?.width(),
        height: this.drawingRect?.height(),
        stroke: "black",
        strokeWidth: 2
      });
      this.layoutLayer?.add(rect);
      this.drawingRect?.destroy();
    });

    this.stage.on("click tap", (e) => {
      if (!e.target.hasName("rect")) {
        return;
      }


    });

    new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.storage.dataset.length > 0) {
          resolve(this.storage.dataset.length);
        }
      }, 1000);
    }).then((res) => {
      this.displayCurrentData()
    })
  }

  displayCurrentData() {
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
      this.imageLayer?.destroyChildren();
      this.imageLayer?.add(dataImage);
    }
    image.src = "data:image/jpeg;base64," + this.storage.current().imageBytes;

    let layout = {} as Annotation;
    switch (this.storage.current().layoutType) {
      case "xml": {
        let json: any;
        parseString(this.storage.current().layout, {
          explicitArray: false, mergeAttrs: true, valueProcessors: [
            parseNumbers,
            parseBooleans
          ]
        }, (err, result) => {
          json = result;
        });

        layout = json.annotation as Annotation;
        break;
      }
      case "json": {

        break;
      }
    }

    this.layoutLayer?.destroyChildren();
    console.log(layout);
    if (layout.object.constructor === Array) {
      layout.object.forEach(value => this.drawBndbox(value.bndbox));
    } else {
      // @ts-ignore
      this.drawBndbox(layout.object.bndbox);
    }
  }

  drawBndbox(bndbox: Bndbox) {
    let rect = new Konva.Rect({
      x: bndbox.xmin,
      y: bndbox.ymin,
      width: bndbox.xmax - bndbox.xmin,
      height: bndbox.ymax - bndbox.ymin,
      stroke: "black",
      strokeWidth: 2,
      // draggable: true
    });

    this.layoutLayer?.add(rect);
  }

  prev() {
    this.storage.prev();
    this.displayCurrentData();
  }

  next() {
    this.storage.next();
    this.displayCurrentData();
  }

  clear() {
    this.imageLayer?.destroyChildren();
    this.layoutLayer?.destroyChildren();
  }
}
