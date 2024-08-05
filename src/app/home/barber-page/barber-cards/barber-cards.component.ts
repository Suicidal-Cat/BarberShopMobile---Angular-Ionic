import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Barber } from 'src/app/models/Barber/barber';
import { Status } from 'src/app/models/Barber/status';
import { Link } from 'src/app/models/Hateoas/Link';
import { LinkCollection } from 'src/app/models/Hateoas/LinkCollection';
import { BarberService } from 'src/app/services/Barber/barber.service';

@Component({
  selector: 'app-barber-cards',
  templateUrl: './barber-cards.component.html',
  styleUrls: ['./barber-cards.component.scss'],
})
export class BarberCardsComponent  implements OnInit {

  @Input() barbers!:LinkCollection<LinkCollection<Barber>[]>;

  constructor(private navCtr:NavController,private barberService:BarberService) { }

  ngOnInit() {}

  getStatusName(statusValue:number){
    return Status[statusValue];
  }

  showDetails(barberId:number,links:Link[]){
    const l=links.find((link)=>link.Rel=="get");
    if(l){
      this.barberService.setBarberLink(l);
      this.navCtr.navigateForward(`home/tabs/barber/details/`+barberId);
    }
    
  }

}
