import { Component, Input, OnInit } from '@angular/core';
import { Barber } from 'src/app/models/Barber/barber';
import { LinkCollection } from 'src/app/models/Hateoas/LinkCollection';

@Component({
  selector: 'app-choose-barber',
  templateUrl: './choose-barber.component.html',
  styleUrls: ['./choose-barber.component.scss'],
})
export class ChooseBarberComponent  implements OnInit {

  @Input() barbers:LinkCollection<Barber>[]=[];
  @Input() barber!:LinkCollection<Barber>;

  constructor() { }

  ngOnInit() {}

  prevBarber(){
    const index=this.barbers.indexOf(this.barber);
    if(index==0)this.barber=this.barbers[this.barbers.length-1];
    else this.barber=this.barbers[index-1];
  }

  nextBarber(){
    const index=this.barbers.indexOf(this.barber);
    if(index==this.barbers.length-1)this.barber=this.barbers[0];
    else this.barber=this.barbers[index+1];
  }

}
