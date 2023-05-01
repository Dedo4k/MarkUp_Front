import {Component, Inject} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CreateUserDto, Role} from "../../../models/user";
import {Dataset} from "../../../models/dataset";

@Component({
  selector: 'app-moderator-create',
  templateUrl: './moderator-create.component.html',
  styleUrls: ['./moderator-create.component.sass']
})
export class ModeratorCreateComponent {

  createForm: FormGroup;

  passwordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get("password");
    const confirmPassword = control.get("confirmPassword");
    return password && confirmPassword && password.value !== confirmPassword.value ? {passwordsNotSame: true} : null;
  }

  constructor(public dialogRef: MatDialogRef<ModeratorCreateComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { roles: Role[], datasets: Dataset[] }) {
    this.createForm = new FormGroup({
        username: new FormControl("", Validators.required),
        password: new FormControl("", Validators.required),
        confirmPassword: new FormControl("", Validators.required),
        roles: new FormControl([], Validators.required),
        datasets: new FormControl([])
      },
      {validators: this.passwordValidator})
  }

  onSubmit(createForm: CreateUserDto) {
    this.dialogRef.close(createForm);
  }
}
