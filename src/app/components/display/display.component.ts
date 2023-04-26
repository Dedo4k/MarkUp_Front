import {Component, OnInit, ViewChild} from '@angular/core';
import Konva from "konva";
import {DatasetStorageService} from "../../services/dataset-storage.service";
import {ActivatedRoute} from "@angular/router";
import {Bndbox, Object} from "../../models/layout/annotation";
import {MatDialog} from "@angular/material/dialog";
import {LabelSelectComponent} from "./label-select/label-select.component";
import {MatSelectionList} from "@angular/material/list";

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.sass']
})
export class DisplayComponent implements OnInit {

  stage: Konva.Stage | undefined;
  imageLayer: Konva.Layer | undefined;
  layoutLayer: Konva.Layer | undefined;
  tooltipLayer: Konva.Layer | undefined;
  layoutTransformer: Konva.Transformer | undefined;
  x1: number | undefined;
  x2: number | undefined;
  y1: number | undefined;
  y2: number | undefined;
  drawingRect: Konva.Rect | undefined;
  tooltip: Konva.Label | undefined;
  changes = false;

  colors = new Map();
  labels = new Map<Konva.Rect, any>();
  allLabels = new Set();

  @ViewChild("labelList")
  labelList: MatSelectionList | undefined;

  constructor(public storage: DatasetStorageService,
              private route: ActivatedRoute,
              private dialog: MatDialog) {
    route.paramMap.subscribe(params => {
      let name = params.get("name");
      if (name != null) {
        storage.downloadDataset(name, () => this.displayCurrentData());
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
    this.tooltipLayer = new Konva.Layer();
    this.stage.add(this.imageLayer);
    this.stage.add(this.layoutLayer);
    this.stage.add(this.tooltipLayer);

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
      if (this.layoutTransformer?.nodes().length) {
        return;
      }

      let rect = new Konva.Rect({
        x: this.drawingRect?.x(),
        y: this.drawingRect?.y(),
        width: this.drawingRect?.width(),
        height: this.drawingRect?.height(),
        stroke: "black",
        strokeWidth: 2,
        strokeScaleEnabled: false
      });
      if (rect.height() != 0 && rect.width() != 0) {
        this.openLabelDialog(this.storage.getLabels()).afterClosed().subscribe(result => {
          if (result?.label.length) {
            let label = result.label instanceof Array ? result.label[0] : result.label;
            rect.setAttr("stroke", this.getColor(label));
            rect.on("mouseenter mousemove", (e) => {
              let pointerPosition = this.stage?.getPointerPosition();

              this.tooltip?.destroy();
              this.tooltip = new Konva.Label({
                x: Number(pointerPosition?.x) + 5,
                y: Number(pointerPosition?.y) + 5
              });
              this.tooltip.add(new Konva.Tag({
                fill: "white",
                stroke: "black",
                strokeWidth: 1
              }));
              this.tooltip?.add(new Konva.Text({
                text: label,
                fontSize: 20,
                fill: "black",
                padding: 3
              }));
              this.tooltipLayer?.add(this.tooltip);
              this.tooltip?.visible(true);
            });
            rect.on("mouseleave", (e) => {
              this.tooltip?.visible(false);
            });
            rect.on("transform", (e) => {
              this.labels.get(e.target as Konva.Rect).text.setAttrs({
                scaleX: 1,
                scaleY: 1
              });
            });
            let text = new Konva.Text({
              x: rect.x(),
              y: rect.y(),
              text: label,
              fill: this.getColor(label),
              fontSize: 14
            });
            this.layoutLayer?.add(rect, text);
            let obj = this.buildObject(rect, label);
            this.storage.current().layout.object.push(obj);
            this.changes = true;
            this.labels.set(rect, {label: label, text: text});
            this.allLabels.add(label);
          } else {
            this.drawingRect?.destroy();
          }
        });
      }
      this.drawingRect?.destroy();
    });

    this.stage.on("click tap", (e) => {
      if (!(e.target instanceof Konva.Rect)) {
        this.layoutTransformer?.nodes().forEach(e => e.setDraggable(false));
        this.layoutTransformer?.destroy();
        this.labelList?.deselectAll();
        return;
      }
      if (this.layoutTransformer?.nodes().includes(e.target)) {
        e.target.draggable(false);
        this.layoutTransformer?.destroy();
        this.labelList?.deselectAll();
        return;
      }

      this.labelList?.deselectAll();
      this.layoutTransformer?.nodes().forEach(e => e.setDraggable(false));
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
      e.target.on("visibleChange", (e) => {
        if (!e.currentTarget.isVisible()) {
          if (this.layoutTransformer?.nodes().includes(e.currentTarget)) {
            this.layoutTransformer?.nodes().forEach(e => e.setDraggable(false));
            this.layoutTransformer?.destroy();
          }
        }
      })
      this.layoutTransformer.nodes([e.target, this.labels.get(e.target).text]);
      let style = this.stage?.container().style as CSSStyleDeclaration;
      style.cursor = "move";

      this.labelList?._items.find(item => item.value == e.target)?._setSelected(true);
    });

    this.stage.on("mouseover", (e) => {
      if (e.target instanceof Konva.Rect) {
        if (this.layoutTransformer?.nodes().includes(e.target)) {
          let style = this.stage?.container().style as CSSStyleDeclaration;
          style.cursor = "move";
        } else {
          let style = this.stage?.container().style as CSSStyleDeclaration;
          style.cursor = "pointer";
        }
      } else if (e.target instanceof Konva.Image) {
        let style = this.stage?.container().style as CSSStyleDeclaration;
        style.cursor = "crosshair";
      } else {
        let style = this.stage?.container().style as CSSStyleDeclaration;
        style.cursor = "default";
      }
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
            let text = this.labels.get(layout as Konva.Rect).text;
            text.destroy();
            layout.destroy();
            this.labels.delete(layout as Konva.Rect);
            this.changes = true;
          });
          this.layoutTransformer?.destroy();
        }
      }
    });
  }

  displayCurrentData() {
    this.labels.clear();
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
      stroke: this.getColor(label),
      strokeWidth: 2,
      strokeScaleEnabled: false
    });
    rect.on("mouseenter mousemove", (e) => {
      let pointerPosition = this.stage?.getPointerPosition();

      this.tooltip?.destroy();
      this.tooltip = new Konva.Label({
        x: Number(pointerPosition?.x) + 5,
        y: Number(pointerPosition?.y) + 5
      });
      this.tooltip.add(new Konva.Tag({
        fill: "white",
        stroke: "black",
        strokeWidth: 1
      }));
      let text = new Konva.Text({
        text: label,
        fontSize: 20,
        fill: "black",
        padding: 3
      });
      this.tooltip?.add(text);
      this.tooltipLayer?.add(this.tooltip);
      this.tooltip?.visible(true);
    });
    rect.on("mouseleave", (e) => {
      this.tooltip?.visible(false);
    });
    rect.on("transform", (e) => {
      this.labels.get(e.target as Konva.Rect).text.setAttrs({
        scaleX: 1,
        scaleY: 1
      });
    });

    let text = new Konva.Text({
      x: bndbox.xmin,
      y: bndbox.ymin,
      text: label,
      fill: this.getColor(label),
      fontSize: 14
    });

    this.layoutLayer?.add(rect, text);
    this.labels.set(rect, {label: label, text: text});
    this.allLabels.add(label);
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

  getColor(label: string) {
    if (!this.colors.has(label)) {
      let color = Math.floor(Math.random() * 16777216).toString(16);
      while (color.length < 6) {
        color = 0 + color;
      }
      this.colors.set(label, "#" + color);
    }
    return this.colors.get(label);
  }

  prev() {
    if (this.changes) {
      this.storage.updateData(this.storage.current());
    }
    this.storage.prev(() => this.displayCurrentData());
  }

  next() {
    if (this.changes) {
      this.storage.updateData(this.storage.current());
    }
    this.storage.next(() => this.displayCurrentData());
  }

  goToData(dataName: string) {
    if (this.changes) {
      this.storage.updateData(this.storage.current());
    }
    this.storage.goToData(dataName, () => this.displayCurrentData());
  }

  selectLabel(rect: Konva.Rect) {
    if (rect.isVisible()) {
      this.stage?.container().focus();
      this.layoutTransformer?.nodes().forEach(e => e.setDraggable(false));
      this.layoutTransformer?.destroy();
      this.layoutTransformer = new Konva.Transformer();
      this.layoutLayer?.add(this.layoutTransformer);
      rect.setDraggable(true);
      this.layoutTransformer.nodes([rect, this.labels.get(rect).text]);
    }
  }

  changeLabelVisibility(rect: Konva.Rect) {
    rect.setAttr("visible", !rect.isVisible());
    let text = this.labels.get(rect).text;
    text.setAttr("visible", !text.isVisible());
  }

  openLabelDialog(labels: string[]) {
    return this.dialog.open(LabelSelectComponent, {data: this.allLabels});
  }
}
