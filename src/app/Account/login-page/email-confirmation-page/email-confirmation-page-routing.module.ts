import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmailConfirmationPagePage } from './email-confirmation-page.page';

const routes: Routes = [
  {
    path: '',
    component: EmailConfirmationPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmailConfirmationPagePageRoutingModule {}
