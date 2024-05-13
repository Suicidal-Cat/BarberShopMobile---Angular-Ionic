import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginPagePage } from './login-page.page';

const routes: Routes = [
  {
    path: '',
    component: LoginPagePage
  },  {
    path: 'email-confirmation-page',
    loadChildren: () => import('./email-confirmation-page/email-confirmation-page.module').then( m => m.EmailConfirmationPagePageModule)
  },
  {
    path: 'password-reset-page',
    loadChildren: () => import('./password-reset-page/password-reset-page.module').then( m => m.PasswordResetPagePageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPagePageRoutingModule {}
