import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { IonicModule } from '@ionic/angular';
import { LatestAppointmentComponent } from '../latest-appointment/latest-appointment.component';
import { AppointmentCardComponent } from '../appointment-card/appointment-card.component';



@NgModule({
  declarations: [ToolbarComponent,LatestAppointmentComponent,AppointmentCardComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports:[ToolbarComponent,LatestAppointmentComponent,AppointmentCardComponent]
})
export class SharedModule { }
