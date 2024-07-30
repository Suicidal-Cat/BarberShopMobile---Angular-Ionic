import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReservationsPagePageRoutingModule } from './reservations-page-routing.module';

import { ReservationsPagePage } from './reservations-page.page';
import { SharedModule } from '../util-components/shared/shared.module';
import { ReservationCalendarComponent } from './reservation-calendar/reservation-calendar.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReservationsPagePageRoutingModule,
    SharedModule,
  ],
  declarations: [ReservationsPagePage,ReservationCalendarComponent]
})
export class ReservationsPagePageModule {}
