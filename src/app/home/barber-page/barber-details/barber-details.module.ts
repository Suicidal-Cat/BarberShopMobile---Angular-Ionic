import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BarberDetailsPageRoutingModule } from './barber-details-routing.module';

import { BarberDetailsPage } from './barber-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BarberDetailsPageRoutingModule
  ],
  declarations: [BarberDetailsPage]
})
export class BarberDetailsPageModule {}
