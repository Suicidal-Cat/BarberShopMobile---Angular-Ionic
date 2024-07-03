import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppointmentPagePage } from './appointment-page.page';

const routes: Routes = [
  {
    path: '',
    component: AppointmentPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppointmentPagePageRoutingModule {}
