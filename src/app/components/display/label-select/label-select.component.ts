import {Component, Inject, Input} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-label-select',
  templateUrl: './label-select.component.html',
  styleUrls: ['./label-select.component.sass']
})
export class LabelSelectComponent {

  selectForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<LabelSelectComponent>,
              @Inject(MAT_DIALOG_DATA) public data: string[]) {
    this.selectForm = new FormGroup({
      label: new FormControl('', Validators.required)
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(label: string): void {
    this.dialogRef.close(label);
  }
}
