import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServicePagePage } from './service-page.page';

const routes: Routes = [
  {
    path: '',
    component: ServicePagePage
  },
  {
    path: 'details/:serviceId',
    loadChildren: () => import('./service-details/service-details.module').then( m => m.ServiceDetailsPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServicePagePageRoutingModule {}
