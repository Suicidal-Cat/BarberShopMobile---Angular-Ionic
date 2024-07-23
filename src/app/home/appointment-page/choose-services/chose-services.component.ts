import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CheckboxChangeEventDetail, IonRadioGroup } from '@ionic/angular';
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
  @Input() serviceCategories:ServiceCategory[]=[];

  servicesId:{category:string,id:number}[]=[];
  servicesOtherId:number[]=[];
  choosenServicesQuery:number[]=[];
  @ViewChildren('radioGroup', { read: ElementRef }) radioGroups!: QueryList<ElementRef>;
  updatePageInit:boolean=true;

  @Output() choosenServices=new EventEmitter<number[]>();

  constructor(private route:ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(paramMap=>{
      const choosenServicesStr = paramMap.get('choosenServices');
      this.choosenServicesQuery = choosenServicesStr ? choosenServicesStr.split(',').map(Number) : [];
    })
  }

  ngAfterViewInit(): void {
  }

  getItems(contentDiv: HTMLDivElement) {
    if(this.updatePageInit){
      this.updatePage();
      this.updatePageInit=false;
    }

    const items=contentDiv.querySelector("#allItems");
    items?.classList.toggle('show-items');

    const arrow=contentDiv.querySelector(".category ion-icon");
    if(arrow?.getAttribute("name")=="chevron-down-outline")arrow?.setAttribute("name","chevron-up-outline");
    else arrow?.setAttribute("name","chevron-down-outline");

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

  updatePage(){
    this.radioGroups.forEach((radioGroup: ElementRef) => {
      const radioButtons = radioGroup.nativeElement.querySelectorAll('ion-radio');
      let found = false;

      radioButtons.forEach((button: any) => {
        if(this.choosenServicesQuery.includes(button.value)){
          radioGroup.nativeElement.value=button.value;
          this.servicesId[this.servicesId.length]={category:radioGroup.nativeElement.name,id:button.value};
          return;
        }
      });

      const otherCategory=document.querySelectorAll('ion-checkbox');
      otherCategory.forEach((checkBox:any)=>{
        if(this.choosenServicesQuery.includes(checkBox.value) && checkBox.checked==false){
          this.servicesOtherId[this.servicesOtherId.length]=checkBox.value;
          checkBox.checked=true;
        }
      })

    });
    console.log(this.servicesId)
    console.log(this.servicesOtherId)
  }

}
