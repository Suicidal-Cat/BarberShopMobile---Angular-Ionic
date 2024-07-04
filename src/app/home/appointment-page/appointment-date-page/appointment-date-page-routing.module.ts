import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppointmentDatePagePage } from './appointment-date-page.page';

const routes: Routes = [
  {
    path: '',
    component: AppointmentDatePagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppointmentDatePagePageRoutingModule {}
