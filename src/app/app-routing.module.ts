import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DatasetsComponent} from "./components/datasets/datasets.component";
import {DisplayComponent} from "./components/display/display.component";
import {ModeratorsComponent} from "./components/moderators/moderators.component";

const routes: Routes = [
  {path: 'datasets', component: DatasetsComponent},
  {path: 'display/:datasetName', component: DisplayComponent},
  {path: 'moderators', component: ModeratorsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
