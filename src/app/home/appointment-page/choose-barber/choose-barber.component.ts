import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Output() barberId=new EventEmitter<number>();

  constructor() { }

  ngOnInit() {}

  prevBarber(){
    const index=this.barbers.indexOf(this.barber);
    if(index==0)this.barber=this.barbers[this.barbers.length-1];
    else this.barber=this.barbers[index-1];
    this.barberId.next(this.barber.Value.BarberId);
  }

  nextBarber(){
    const index=this.barbers.indexOf(this.barber);
    if(index==this.barbers.length-1)this.barber=this.barbers[0];
    else this.barber=this.barbers[index+1];
    this.barberId.emit(this.barber.Value.BarberId);
  }



}
