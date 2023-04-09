import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MarkupComponent} from "./components/markup/markup.component";
import {DatasetsComponent} from "./components/datasets/datasets.component";

const routes: Routes = [
  {path: 'markup', component: MarkupComponent},
  {path: 'datasets', component: DatasetsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
