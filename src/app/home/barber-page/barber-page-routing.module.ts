import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BarberPagePage } from './barber-page.page';

const routes: Routes = [
  {
    path: '',
    component: BarberPagePage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BarberPagePageRoutingModule {}
