import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppointmentPagePage } from './appointment-page.page';

const routes: Routes = [
  {
    path: '',
    component: AppointmentPagePage
  },
  {
    path: 'appointment-date',
    loadChildren: () => import('./appointment-date-page/appointment-date-page.module').then(m => m.AppointmentDatePagePageModule)
  },   {
    path: 'choose-services-page',
    loadChildren: () => import('./choose-services-page/choose-services-page.module').then( m => m.ChooseServicesPagePageModule)
  },  {
    path: 'choose-barbers-page',
    loadChildren: () => import('./choose-barbers-page/choose-barbers-page.module').then( m => m.ChooseBarbersPagePageModule)
  }




];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppointmentPagePageRoutingModule {}
