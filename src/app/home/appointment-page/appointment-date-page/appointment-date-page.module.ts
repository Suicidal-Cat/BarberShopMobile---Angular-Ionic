import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppointmentDatePagePageRoutingModule } from './appointment-date-page-routing.module';

import { AppointmentDatePagePage } from './appointment-date-page.page';
import { SharedModule } from "../../util-components/shared/shared.module";
import { AppointmentCalendarComponent } from './appointment-calendar/appointment-calendar.component';

@NgModule({
    declarations: [AppointmentDatePagePage,AppointmentCalendarComponent],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AppointmentDatePagePageRoutingModule,
        SharedModule
    ]
})
export class AppointmentDatePagePageModule {}
