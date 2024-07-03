import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { CheckboxChangeEventDetail } from '@ionic/angular';
import { IonCheckboxCustomEvent, IonRadioGroupCustomEvent, RadioGroupChangeEventDetail } from '@ionic/core';
import { LinkCollection } from 'src/app/models/Hateoas/LinkCollection';
import { ServiceCategory } from 'src/app/models/ServiceCategory/serviceCategory';
import { Service } from 'src/app/models/ServiceD/service';

@Component({
  selector: 'app-choose-services',
  templateUrl: './choose-services.component.html',
  styleUrls: ['./choose-services.component.scss'],
})
export class ChooseServicesComponent  implements OnInit,AfterViewInit{

  @Input() services!:LinkCollection<Service>[];
  @Input() serviceCategories!:ServiceCategory[];
  servicesId:{category:string,id:number}[]=[];
  servicesOtherId:number[]=[];
  @Output() choosenServices=new EventEmitter<number[]>();

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    
  }

  getItems(contentDiv: HTMLDivElement) {
    const items=contentDiv.querySelector("#allItems");
    items?.classList.toggle('show-items');
  }

  addChoosenService(event: IonRadioGroupCustomEvent<RadioGroupChangeEventDetail<any>>,category:string) {
    let found:Boolean=false;
    this.servicesId.forEach(element => {
      if(element.category==category){
        element.id=event.detail.value;
        found=true;
        return;
      }
    });

    if(found==false)this.servicesId[this.servicesId.length]={category:category,id:event.detail.value};
    else this.servicesId=this.servicesId.filter((value)=>value.id!=undefined)
    this.emitValues();
  }

  addOtherService(event: IonCheckboxCustomEvent<CheckboxChangeEventDetail<any>>) {
    if(event.detail.checked==true){
      this.servicesOtherId[this.servicesOtherId.length]=event.detail.value;
    }
    else {
      this.servicesOtherId=this.servicesOtherId.filter((id)=>id!=event.detail.value)
    }
    this.emitValues();
  }

  emitValues(){

    const servicesIdValues = this.servicesId.map(service => service.id);
    const mergedArray = servicesIdValues.concat(this.servicesOtherId);
    
    this.choosenServices.emit(mergedArray);
  }

}
