import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { IonicModule } from '@ionic/angular';
import { LatestAppointmentComponent } from '../latest-appointment/latest-appointment.component';



@NgModule({
  declarations: [ToolbarComponent,LatestAppointmentComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports:[ToolbarComponent,LatestAppointmentComponent]
})
export class SharedModule { }
