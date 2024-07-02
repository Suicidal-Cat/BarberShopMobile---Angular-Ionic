import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServicePagePageRoutingModule } from './service-page-routing.module';

import { ServicePagePage } from './service-page.page';
import { ServiceCardsComponent } from './service-cards/service-cards.component';
import { SharedModule } from '../util-components/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServicePagePageRoutingModule,
    SharedModule
  ],
  declarations: [ServicePagePage,ServiceCardsComponent]
})
export class ServicePagePageModule {}
