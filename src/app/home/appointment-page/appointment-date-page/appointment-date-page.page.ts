import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-appointment-date-page',
  templateUrl: './appointment-date-page.page.html',
  styleUrls: ['./appointment-date-page.page.scss'],
})
export class AppointmentDatePagePage implements OnInit {

  barberId:number=0;
  choosenServices:number[]=[];


  constructor() { }

  ngOnInit() {
  }

}
