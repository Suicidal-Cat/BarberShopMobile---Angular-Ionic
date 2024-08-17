import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChooseServicesPagePageRoutingModule } from './choose-services-page-routing.module';

import { ChooseServicesPagePage } from './choose-services-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChooseServicesPagePageRoutingModule
  ],
  declarations: [ChooseServicesPagePage]
})
export class ChooseServicesPagePageModule {}
