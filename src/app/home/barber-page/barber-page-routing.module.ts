import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BarberPagePage } from './barber-page.page';

const routes: Routes = [
  {
    path: '',
    component: BarberPagePage
  },
  {
    path: 'details/:barberId',
    loadChildren: () => import('./barber-details/barber-details.module').then( m => m.BarberDetailsPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BarberPagePageRoutingModule {}
