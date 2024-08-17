import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChooseBarbersPagePage } from './choose-barbers-page.page';

const routes: Routes = [
  {
    path: '',
    component: ChooseBarbersPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChooseBarbersPagePageRoutingModule {}
