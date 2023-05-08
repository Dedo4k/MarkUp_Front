import {ErrorHandler, Injectable, NgZone} from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ErrorDto} from "../models/error-dto";
import {ErrorComponent} from "../components/error/error.component";

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements ErrorHandler {

  constructor(private snackbar: MatSnackBar,
              private zone: NgZone) {
  }

  handleError(error: any): void {
    switch (typeof error) {
      case "object":
        if (error as Object instanceof HttpErrorResponse) {
          this.openSnackBar((error as HttpErrorResponse).error as ErrorDto);
        }
        break;
    }
    console.error(error);
  }

  openSnackBar(error: ErrorDto) {
    this.zone.run(() => this.snackbar.openFromComponent(ErrorComponent, {
      data: error,
      duration: 5000,
      horizontalPosition: "center",
      verticalPosition: "top"
    }));
  }
}
