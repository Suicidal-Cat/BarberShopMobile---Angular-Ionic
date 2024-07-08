import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { adminAuthorizationGuard } from '../guards/admin-authorization.guard';

const routes: Routes = [
  {
    path: 'tabs',
    component: HomePage,
    canMatch:[adminAuthorizationGuard],
    children:[
      {
        path: 'service',
        loadChildren: () => import('./service-page/service-page.module').then( m => m.ServicePagePageModule)
      },
      {
        path: 'barber',
        loadChildren: () => import('./barber-page/barber-page.module').then( m => m.BarberPagePageModule)
      },
      {
        path: 'reservations',
        loadChildren: () => import('./reservations-page/reservations-page.module').then( m => m.ReservationsPagePageModule)
      },
    ]
    
  },
  {
    path:"",
    component:HomePage,
  },
  {
    path: 'appointment',
    loadChildren: () => import('./appointment-page/appointment-page.module').then( m => m.AppointmentPagePageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
