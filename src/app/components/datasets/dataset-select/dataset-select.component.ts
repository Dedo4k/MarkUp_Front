import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Dataset} from "../../../models/dataset";

@Component({
  selector: 'app-dataset-select',
  templateUrl: './dataset-select.component.html',
  styleUrls: ['./dataset-select.component.sass']
})
export class DatasetSelectComponent {

  selectForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<DatasetSelectComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Dataset[]
  ) {
    console.log(data)
    this.selectForm = new FormGroup({
      datasets: new FormControl('', Validators.required)
    });
  }

  onSubmit(datasets: string[]): void {
    this.dialogRef.close(datasets);
  }
}
