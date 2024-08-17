import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChooseBarbersPagePageRoutingModule } from './choose-barbers-page-routing.module';

import { ChooseBarbersPagePage } from './choose-barbers-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChooseBarbersPagePageRoutingModule
  ],
  declarations: [ChooseBarbersPagePage]
})
export class ChooseBarbersPagePageModule {}
