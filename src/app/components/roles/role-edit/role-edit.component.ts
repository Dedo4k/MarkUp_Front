import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {EditRoleDto, Operation, Role} from "../../../models/user";

@Component({
  selector: 'app-role-edit',
  templateUrl: './role-edit.component.html',
  styleUrls: ['./role-edit.component.sass']
})
export class RoleEditComponent {

  editForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<RoleEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {
                role: Role,
                operations: Operation[]
              }) {
    this.editForm = new FormGroup({
      operations: new FormControl(data.role.operations.map(op => op.id), Validators.required)
    });
  }

  onSubmit(editRleDto: EditRoleDto): void {
    this.dialogRef.close(editRleDto);
  }
}
