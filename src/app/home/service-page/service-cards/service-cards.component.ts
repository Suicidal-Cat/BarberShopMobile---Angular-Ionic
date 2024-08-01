import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Link } from 'src/app/models/Hateoas/Link';
import { LinkCollection } from 'src/app/models/Hateoas/LinkCollection';
import { Service } from 'src/app/models/ServiceD/service';
import { ServiceService } from 'src/app/services/ServiceD/service.service';

@Component({
  selector: 'app-service-cards',
  templateUrl: './service-cards.component.html',
  styleUrls: ['./service-cards.component.scss'],
})
export class ServiceCardsComponent  implements OnInit {

  @Input() services!:LinkCollection<LinkCollection<Service>[]>;

  constructor(private serviceService:ServiceService,private router:Router) { }

  ngOnInit() {}

  deleteService(links:Link[],id:number){
    const link=links.find((link)=>link.Rel=="delete")
    if(link)this.serviceService.deleteService(link,id).subscribe({
      error:(err)=>{
        console.log(err.error.message);
      }
    });
  }

  showServiceDetails(serviceId:number,links:Link[]) {
    const link:Link | undefined=links.find((link)=>link.Rel=="get");
    if(link){
      this.serviceService.setServiceLink(link);
      this.router.navigateByUrl(`/home/tabs/service/details/${serviceId}`)
    };
  }


  getImagePath(name:string){
    if(name=="Haircuts")return '../../../../assets/images/Haircut.png';
    else if(name=='Beard')return '../../../../assets/images/Beard.png';
    else return '../../../../assets/images/Other.png';
  }
}
