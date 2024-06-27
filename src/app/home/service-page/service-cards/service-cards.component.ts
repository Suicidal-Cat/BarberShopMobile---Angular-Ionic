import { Component, Input, OnInit } from '@angular/core';
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

  constructor(private serviceService:ServiceService) { }

  ngOnInit() {}

  deleteService(links:Link[],id:number){
    const link=links.find((link)=>link.Rel=="delete")
    if(link)this.serviceService.deleteService(link,id).subscribe({
      error:(err)=>{
        console.log(err.error.message);
      }
    });
  }

}
