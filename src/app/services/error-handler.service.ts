import {ErrorHandler, Injectable, NgZone} from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";

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
          this.openSnackBar((error as HttpErrorResponse).message);
        }
        break;
    }
    console.error(error);
  }

  openSnackBar(message: string) {
    this.zone.run(() => this.snackbar.open(message, "", {
      duration: 3000,
      horizontalPosition: "center",
      verticalPosition: "top"
    }));
  }
}
