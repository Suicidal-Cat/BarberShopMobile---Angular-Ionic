import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServicePagePage } from './service-page.page';

const routes: Routes = [
  {
    path: '',
    component: ServicePagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServicePagePageRoutingModule {}
