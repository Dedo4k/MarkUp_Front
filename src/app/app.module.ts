import {Injectable, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './components/app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FooterComponent} from './components/footer/footer.component';
import {HeaderComponent} from './components/header/header.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatSidenavModule} from "@angular/material/sidenav";
import {DatasetsComponent} from './components/datasets/datasets.component';
import {HTTP_INTERCEPTORS, HttpClientModule, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {MatListModule} from "@angular/material/list";
import {AuthService} from "./services/auth.service";
import {MatDialogModule} from "@angular/material/dialog";
import {LoginComponent} from './components/login/login.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatMenuModule} from "@angular/material/menu";
import {MatCardModule} from "@angular/material/card";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {DisplayComponent} from './components/display/display.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {LabelSelectComponent} from './components/display/label-select/label-select.component';
import {MatOptionModule} from "@angular/material/core";
import {MatTooltipModule} from "@angular/material/tooltip";
import {ModeratorsComponent} from './components/moderators/moderators.component';
import { DatasetSelectComponent } from './components/datasets/dataset-select/dataset-select.component';
import { ModeratorCreateComponent } from './components/moderators/moderator-create/moderator-create.component';
import {MatSelectModule} from "@angular/material/select";

@Injectable()
export class XhrInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const xhr = req.clone({
      headers: req.headers.set('X-Requested-With', 'XMLHttpRequest')
    });
    return next.handle(xhr);
  }
}

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    DatasetsComponent,
    LoginComponent,
    DisplayComponent,
    LabelSelectComponent,
    ModeratorsComponent,
    DatasetSelectComponent,
    ModeratorCreateComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    HttpClientModule,
    MatListModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
    MatMenuModule,
    MatCardModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatOptionModule,
    MatTooltipModule,
    MatSelectModule
  ],
  providers: [AuthService, {provide: HTTP_INTERCEPTORS, useClass: XhrInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
