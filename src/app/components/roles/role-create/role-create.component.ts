import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CreateRoleDto, Operation} from "../../../models/user";

@Component({
  selector: 'app-role-create',
  templateUrl: './role-create.component.html',
  styleUrls: ['./role-create.component.sass']
})
export class RoleCreateComponent {

  createForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<RoleCreateComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Operation[]) {
    this.createForm = new FormGroup({
      name: new FormControl("ROLE_", Validators.required),
      operations: new FormControl("", Validators.required)
    });
  }

  onSubmit(createRoleDto: CreateRoleDto): void {
    this.dialogRef.close(createRoleDto);
  }
}
