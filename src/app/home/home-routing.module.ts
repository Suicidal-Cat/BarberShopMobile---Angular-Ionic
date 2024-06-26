import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'service',
    loadChildren: () => import('./service-page/service-page.module').then( m => m.ServicePagePageModule)
  },
  {
    path: 'barber',
    loadChildren: () => import('./barber-page/barber-page.module').then( m => m.BarberPagePageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
