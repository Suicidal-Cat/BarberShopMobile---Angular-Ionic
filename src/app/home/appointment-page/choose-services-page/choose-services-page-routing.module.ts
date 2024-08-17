import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChooseServicesPagePage } from './choose-services-page.page';

const routes: Routes = [
  {
    path: '',
    component: ChooseServicesPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChooseServicesPagePageRoutingModule {}
