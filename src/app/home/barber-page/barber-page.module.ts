import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BarberPagePageRoutingModule } from './barber-page-routing.module';

import { BarberPagePage } from './barber-page.page';
import { BarberCardsComponent } from './barber-cards/barber-cards.component';
import { SharedModule } from '../util-components/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BarberPagePageRoutingModule,
    SharedModule,
  ],
  declarations: [BarberPagePage,BarberCardsComponent]
})
export class BarberPagePageModule {}
