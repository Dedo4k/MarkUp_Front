import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MarkupComponent} from "./components/markup/markup.component";

const routes: Routes = [
  {path: 'markup', component: MarkupComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
