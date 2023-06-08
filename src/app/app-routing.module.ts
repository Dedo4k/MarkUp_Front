import {inject, NgModule} from '@angular/core';
import {ActivatedRouteSnapshot, RouterModule, RouterStateSnapshot, Routes} from '@angular/router';
import {DatasetsComponent} from "./components/datasets/datasets.component";
import {DisplayComponent} from "./components/display/display.component";
import {ModeratorsComponent} from "./components/moderators/moderators.component";
import {RolesComponent} from "./components/roles/roles.component";
import {GuardService} from "./services/guard.service";
import {MainComponent} from "./components/main/main.component";

const activateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => inject(GuardService)
  .canActivate(route, state);

const routes: Routes = [
  {path: 'datasets', component: DatasetsComponent, canActivate: [activateFn]},
  {path: 'display/:datasetName', component: DisplayComponent, canActivate: [activateFn]},
  {path: 'moderators', component: ModeratorsComponent, canActivate: [activateFn]},
  {path: 'roles', component: RolesComponent, canActivate: [activateFn]},
  {path: 'main', component: MainComponent},
  {path: '**', redirectTo: "main"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
