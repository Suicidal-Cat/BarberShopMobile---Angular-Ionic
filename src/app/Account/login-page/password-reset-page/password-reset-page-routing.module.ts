import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PasswordResetPagePage } from './password-reset-page.page';

const routes: Routes = [
  {
    path: '',
    component: PasswordResetPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PasswordResetPagePageRoutingModule {}
