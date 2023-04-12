import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MarkupComponent} from "./components/markup/markup.component";
import {DatasetsComponent} from "./components/datasets/datasets.component";
import {DatasetDetailsComponent} from "./components/datasets/dataset-details/dataset-details.component";

const routes: Routes = [
  {path: 'markup', component: MarkupComponent},
  {path: 'datasets', component: DatasetsComponent},
  {path: 'datasets/:name', component: DatasetDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
