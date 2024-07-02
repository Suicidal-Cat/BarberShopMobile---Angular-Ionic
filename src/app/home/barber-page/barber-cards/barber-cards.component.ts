import { Component, Input, OnInit } from '@angular/core';
import { Barber } from 'src/app/models/Barber/barber';
import { Status } from 'src/app/models/Barber/status';
import { LinkCollection } from 'src/app/models/Hateoas/LinkCollection';
import { BarberService } from 'src/app/services/Barber/barber.service';

@Component({
  selector: 'app-barber-cards',
  templateUrl: './barber-cards.component.html',
  styleUrls: ['./barber-cards.component.scss'],
})
export class BarberCardsComponent  implements OnInit {

  @Input() barbers!:LinkCollection<LinkCollection<Barber>[]>;

  constructor(private barberService:BarberService) { }

  ngOnInit() {}

  getStatusName(statusValue:number){
    return Status[statusValue];
  }

}
