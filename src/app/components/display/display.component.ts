import {Component, OnInit} from '@angular/core';
import Konva from "konva";
import {DatasetStorageService} from "../../services/dataset-storage.service";
import {ActivatedRoute} from "@angular/router";
import {Bndbox, Object} from "../../models/layout/annotation";
import {MatDialog} from "@angular/material/dialog";
import {LabelSelectComponent} from "./label-select/label-select.component";
import {DatasetStorageV2Service} from "../../services/dataset-storage-v2.service";

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
  changes = false;

  constructor(public storage: DatasetStorageService,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              public st: DatasetStorageV2Service) {
    route.paramMap.subscribe(params => {
      let name = params.get("name");
      if (name != null) {

        storage.downloadDataset(name, () => this.displayCurrentData());
        // st.downloadDataset(name)
        // .subscribe(result => {
        //   while(result.length <= 0) {
        //     console.log("wait");
        //   }
        //   console.log("draw");
        // })
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
      if (this.layoutTransformer?.nodes().length) {
        return;
      }

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
      this.layoutLayer?.add(this.drawingRect);
    });

    this.stage.on("mousemove touchmove", (e) => {
      if (this.layoutTransformer?.nodes().length) {
        return;
      }

      e.evt.preventDefault();
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
      if (rect.height() != 0 && rect.width() != 0) {
        this.openLabelDialog(this.storage.getLabels()).afterClosed().subscribe(result => {
          if (result?.label.length) {
            let label = result.label instanceof Array ? result.label[0] : result.label;
            rect.setAttr("stroke", this.storage.getColor(label));
            this.layoutLayer?.add(rect);
            let obj = this.buildObject(rect, label);
            this.storage.current().layout.object.push(obj);
            this.changes = true;
          } else {
            this.drawingRect?.destroy();
          }
        });
      }
      this.drawingRect?.destroy();
    });

    this.stage.on("click tap", (e) => {
      if (!(e.target instanceof Konva.Rect)) {
        e.target.setDraggable(false);
        this.layoutTransformer?.destroy();
        return;
      }
      if (this.layoutTransformer?.nodes().includes(e.target)) {
        e.target.setDraggable(false);
        this.layoutTransformer?.destroy();
        return;
      }

      this.layoutTransformer?.destroy();
      this.layoutTransformer = new Konva.Transformer();
      this.layoutLayer?.add(this.layoutTransformer);
      e.target.setDraggable(true);
      e.target.on("dragstart", (e) => {
        this.changes = true;
      });
      e.target.on("transformstart", (e) => {
        this.changes = true;
      })
      this.layoutTransformer.nodes([e.target]);
    });

    let container = this.stage.container();
    container.tabIndex = 1;
    container.focus();

    container.addEventListener("keydown", (e) => {
      if (this.layoutTransformer?.nodes().length) {
        if (e.code == "Delete") {
          this.layoutTransformer?.nodes().forEach(layout => {
            this.storage.current().layout.object = this.storage.current().layout.object
              .filter(value => value.bndbox.xmin !== layout.x()
                && value.bndbox.ymin !== layout.y()
                && value.bndbox.xmax !== layout.x() + layout.width()
                && value.bndbox.ymax !== layout.y() + layout.height());
            layout.destroy();
            this.changes = true;
          });
          this.layoutTransformer?.destroy();
        }
      }
    });

    // new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     if (this.storage.dataset.length > 0) {
    //       resolve(this.storage.dataset.length);
    //     }
    //   }, 1000);
    // }).then((res) => {
    //   this.displayCurrentData()
    // })
  }

  displayCurrentData() {
    this.stage?.container().focus();
    this.changes = false;

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

    this.layoutLayer?.destroyChildren();
    this.storage.current().layout.object.forEach(value => this.drawBndbox(value.bndbox, value.name));
  }

  drawBndbox(bndbox: Bndbox, label: string) {
    let rect = new Konva.Rect({
      x: bndbox.xmin,
      y: bndbox.ymin,
      width: bndbox.xmax - bndbox.xmin,
      height: bndbox.ymax - bndbox.ymin,
      stroke: this.storage.getColor(label),
      strokeWidth: 2
    });

    this.layoutLayer?.add(rect);
  }

  buildObject(rect: Konva.Rect, label: string) {
    return {
      name: label,
      bndbox: {
        xmin: Math.round(rect.x()),
        ymin: Math.round(rect.y()),
        xmax: Math.round(rect.x() + rect.width()),
        ymax: Math.round(rect.y() + rect.height())
      } as Bndbox,
      difficult: 0,
      pose: "Unspecified",
      truncated: 0
    } as Object;
  }

  prev() {
    if (this.changes) {
      this.storage.updateData(this.storage.current());
    }
    this.storage.prev(() => this.displayCurrentData());
    // this.displayCurrentData();
  }

  next() {
    if (this.changes) {
      this.storage.updateData(this.storage.current());
    }
    this.storage.next(() => this.displayCurrentData());
    // this.displayCurrentData();
  }

  openLabelDialog(labels: string[]) {
    return this.dialog.open(LabelSelectComponent, {data: labels});
  }

  goToData(dataName: string) {
    this.storage.goToData(dataName, () => this.displayCurrentData());
  }
}
