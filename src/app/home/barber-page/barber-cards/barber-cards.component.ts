import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Barber } from 'src/app/models/Barber/barber';
import { Status } from 'src/app/models/Barber/status';
import { Link } from 'src/app/models/Hateoas/Link';
import { LinkCollection } from 'src/app/models/Hateoas/LinkCollection';
import { BarberService } from 'src/app/services/Barber/barber.service';
import { OneDriveService } from 'src/app/services/one-drive.service';

@Component({
  selector: 'app-barber-cards',
  templateUrl: './barber-cards.component.html',
  styleUrls: ['./barber-cards.component.scss'],
})
export class BarberCardsComponent  implements OnInit,OnChanges{

  @Input() barbers!:LinkCollection<LinkCollection<Barber>[]>;
  loadedPic:boolean=false;

  constructor(private navCtr:NavController,private barberService:BarberService,private oneDrive:OneDriveService) { }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    let i=0;
    if(this.barbers.Value.length>0){
      this.barbers.Value.forEach((element) => {
        this.oneDrive.getImageUrl(element.Value.ImageUrl).subscribe((data)=>{
          i++;
          if(data && data['@microsoft.graph.downloadUrl']){
            element.Value.ImageUrl=data['@microsoft.graph.downloadUrl'];
          }
          else element.Value.ImageUrl='../../../../assets/images/maleBarber.jpg';
          if(i==this.barbers.Value.length)this.loadedPic=true;
        })
      });
    }
  }

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
