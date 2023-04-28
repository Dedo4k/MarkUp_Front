import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {EditUserDto, Moderator, Role} from "../../../models/user";
import {Dataset} from "../../../models/dataset";

@Component({
  selector: 'app-moderator-edit',
  templateUrl: './moderator-edit.component.html',
  styleUrls: ['./moderator-edit.component.sass']
})
export class ModeratorEditComponent {

  editForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<ModeratorEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {
                moderator: Moderator,
                roles: Role[],
                datasets: Dataset[]
              }) {
    this.editForm = new FormGroup({
      roles: new FormControl(data.moderator.roles.map(role => role.id), Validators.required),
      datasets: new FormControl(data.moderator.datasets.map(dataset => dataset.name))
    });
  }

  onSubmit(editUserDto: EditUserDto): void {
    this.dialogRef.close(editUserDto);
  }
}
