import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReservationsPagePage } from './reservations-page.page';

const routes: Routes = [
  {
    path: '',
    component: ReservationsPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReservationsPagePageRoutingModule {}
