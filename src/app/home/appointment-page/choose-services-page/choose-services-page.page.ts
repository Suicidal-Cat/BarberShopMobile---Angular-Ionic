import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { LinkCollection } from 'src/app/models/Hateoas/LinkCollection';
import { ServiceCategory } from 'src/app/models/ServiceCategory/serviceCategory';
import { Service } from 'src/app/models/ServiceD/service';
import { ServiceService } from 'src/app/services/ServiceD/service.service';
import Swiper from 'swiper';
import { register } from 'swiper/element/bundle';
register();

@Component({
  selector: 'app-choose-services-page',
  templateUrl: './choose-services-page.page.html',
  styleUrls: ['./choose-services-page.page.scss'],
})
export class ChooseServicesPagePage implements OnInit,ViewWillEnter,OnDestroy {

  barberId:number=0;
  choosenServices:number[]=[];
  appointmentId:number=0;

  services!: LinkCollection<LinkCollection<Service>[]>;
  serviceCategories:ServiceCategory[]=[];
  servicesSub!: Subscription;
  categoriesSub!:Subscription;

  selectedCategory:string='';
  currentServices!:LinkCollection<Service>[];
  servicesByCategories:Array<LinkCollection<Service>[]>=[];

  @ViewChild('swiper')swiperRef:ElementRef|undefined;
  swiper?:Swiper;

  constructor(private route:ActivatedRoute,
    private router:Router,private serviceService:ServiceService) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(paramMap=>{
      if(paramMap.has('barberId')){
        const barber=paramMap.get('barberId');
        if(barber)this.barberId = parseInt(barber);
        const choosenServicesStr = paramMap.get('choosenServices');
        this.choosenServices = choosenServicesStr ? choosenServicesStr.split(',').map(Number) : [];

        if(paramMap.has('appointment')){
          const id=paramMap.get('appointment')
          if(id)this.appointmentId=parseInt(id);
        }
      }
    })

    this.servicesSub = this.serviceService.servicesPag.subscribe((services) => {
      this.services = services;
      if(this.servicesByCategories.length==0 && this.selectedCategory!='' && this.services.Value.length>0){
       this.serviceCategories.forEach(category => {
        this.servicesByCategories.push(this.services.Value.filter(s=>s.Value.ServiceCategory.Name==category.Name));
       });
      }
    });

    this.categoriesSub=this.serviceService.serviceCategories.subscribe((categories)=>{
      if(categories.length>0){
        this.serviceCategories=categories;
        this.selectedCategory=categories[0].Name;
        if(this.servicesByCategories.length==0 && this.selectedCategory!='' && this.services.Value.length>0){
          this.serviceCategories.forEach(category => {
            this.servicesByCategories.push(this.services.Value.filter(s=>s.Value.ServiceCategory.Name==category.Name));
           });
        }
      }
    })
  }

  ionViewWillEnter(): void {
    this.serviceService.getServices()?.subscribe();
    this.serviceService.getServiceCategories()?.subscribe();
    this.swiper=this.swiperRef?.nativeElement.swiper;
  }

  ngOnDestroy(): void {
    if(this.servicesSub)this.servicesSub.unsubscribe();
    if(this.categoriesSub)this.categoriesSub.unsubscribe();
  }

  slideNext(){
    this.swiper?.slideNext(700);
  }

  slidePrev(){
    this.swiper?.slidePrev(700);
  }

  slideTo(slide:number){
    this.swiper?.slideTo(slide,700);
  }

  changeCategory(category: string) {
    this.selectedCategory=category;
    const slide=this.serviceCategories.findIndex(s=>s.Name==category);
    this.slideTo(slide);
  }

  getImagePath(name:string){
    if(name=="Haircuts")return '../../../../assets/images/Haircut.png';
    else if(name=='Beard')return '../../../../assets/images/Beard.png';
    else return '../../../../assets/images/Other.png';
  }

  swiperSlideChanged(event: any) {
    const index=event.detail[0].realIndex;
    this.selectedCategory=this.serviceCategories[index].Name;
    // console.log(event);
  }

  canForward():boolean{
    const index=this.serviceCategories.findIndex(s=>s.Name==this.selectedCategory);
    if(index==this.serviceCategories.length-1)return false;
    return true
  }

  generateForward():string{
    const index=this.serviceCategories.findIndex(s=>s.Name==this.selectedCategory);
    let name=this.serviceCategories[index+1].Name;
    if(name=="Beard")return "Choose beard trim";
    else if(name=="Other") return "Choose other services";
    else return "Choose " + name;
  }

  canBackwards():boolean{
    const index=this.serviceCategories.findIndex(s=>s.Name==this.selectedCategory);
    if(index==0)return false;
    return true
  }

  generateBackwards():string{
    const index=this.serviceCategories.findIndex(s=>s.Name==this.selectedCategory);
    let name=this.serviceCategories[index-1].Name;
    if(name=="Haircut")return "Choose haircut";
    else if(name=="Beard") return "Choose beard trim";
    else return "Choose " + name;
  }


}
