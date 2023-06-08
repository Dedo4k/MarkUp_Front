import {Component, Inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA} from "@angular/material/snack-bar";
import {ErrorDto} from "../../models/error-dto";

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.sass']
})
export class ErrorComponent {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: ErrorDto) {
  }
}
