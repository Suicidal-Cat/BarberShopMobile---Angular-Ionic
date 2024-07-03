import { AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CheckboxChangeEventDetail } from '@ionic/angular';
import { IonCheckboxCustomEvent } from '@ionic/core';
import { LinkCollection } from 'src/app/models/Hateoas/LinkCollection';
import { ServiceCategory } from 'src/app/models/ServiceCategory/serviceCategory';
import { Service } from 'src/app/models/ServiceD/service';

@Component({
  selector: 'app-chose-services',
  templateUrl: './chose-services.component.html',
  styleUrls: ['./chose-services.component.scss'],
})
export class ChoseServicesComponent  implements OnInit,AfterViewInit{

  @Input() services!:LinkCollection<Service>[];
  @Input() serviceCategories!:ServiceCategory[];

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    
  }

  getItems(contentDiv: HTMLDivElement) {
    const items=contentDiv.querySelector("#allItems");
    items?.classList.toggle('show-items');
  }

  addOtherService(event: IonCheckboxCustomEvent<CheckboxChangeEventDetail<any>>) {
    console.log(event.detail.checked)
    console.log(event.detail.value)
  }

}
