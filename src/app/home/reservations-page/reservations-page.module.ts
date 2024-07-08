import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReservationsPagePageRoutingModule } from './reservations-page-routing.module';

import { ReservationsPagePage } from './reservations-page.page';
import { SharedModule } from '../util-components/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReservationsPagePageRoutingModule,
    SharedModule
  ],
  declarations: [ReservationsPagePage]
})
export class ReservationsPagePageModule {}
