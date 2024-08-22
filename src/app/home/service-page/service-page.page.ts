import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import { IonInputCustomEvent,InputInputEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';
import { LinkCollection } from 'src/app/models/Hateoas/LinkCollection';
import { ServiceCategory } from 'src/app/models/ServiceCategory/serviceCategory';
import { Service } from 'src/app/models/ServiceD/service';
import { ServiceService } from 'src/app/services/ServiceD/service.service';

@Component({
  selector: 'app-service-page',
  templateUrl: './service-page.page.html',
  styleUrls: ['./service-page.page.scss'],
})
export class ServicePagePage implements OnInit,ViewWillEnter,OnDestroy {

  services!:LinkCollection<LinkCollection<Service>[]>;
  serviceCategories:ServiceCategory[]=[];
  servicesSub!: Subscription;
  categoriesSub!:Subscription;

  nextPage:boolean=true;
  prevPage:boolean=false;
  selectedCategory:string='all';
  noServicesMessage:boolean=false;
  maxPages:number=0;
  selectedPage:number=1;
  showSpinner:boolean=false;

  constructor(private serviceService:ServiceService,private router:Router) { }

  ngOnInit() {
    this.servicesSub=this.serviceService.servicesPag.subscribe((services)=>{
      if(services.Value.length==0)this.noServicesMessage=true;
      else this.noServicesMessage=false;
      this.services=services;
      if(this.services.Links.find((link)=>link.Rel=="prev")!=undefined)this.prevPage=true;
      else this.prevPage=false;
      if(this.services.Links.find((link)=>link.Rel=="next")!=undefined)this.nextPage=true;
      else this.nextPage=false;
      if(this.serviceService.MaxPages!=0)this.maxPages=this.serviceService.MaxPages;
      this.showSpinner=false;
      if(services.Value.length==0)this.maxPages=1;
    })
    this.categoriesSub=this.serviceService.serviceCategories.subscribe((categories)=>{
      if(categories.length>0){
        this.serviceCategories=categories;
      }
    })
  }

  ionViewWillEnter(): void {
    this.showSpinner=true;
    this.serviceService.getServicesPagination()?.subscribe();
    this.serviceService.getServiceCategories()?.subscribe();
  }

  getPrevPage(){
    if(this.selectedPage>1){
      this.showSpinner=true;
      const link=this.services.Links.find((link)=>link.Rel=="prev");
      this.serviceService.getServicesPagination(link?.Href)?.subscribe();
      this.selectedPage=this.selectedPage-1;
    }
  }

  getNextPage(){
    if(this.selectedPage<this.maxPages){
      this.showSpinner=true;
      const link=this.services.Links.find((link)=>link.Rel=="next");
      this.serviceService.getServicesPagination(link?.Href)?.subscribe();
      this.selectedPage=this.selectedPage+1;
    }
  }

  filterServices(serviceName:string="",category:string=""){
    this.showSpinner=true;
    const link=this.services.Links.find((link)=>link.Rel=="curr");
    if(link){
      var href=link?.Href;
      href=href.replace(/pageNumber=[^&]*/,"pageNumber=1");
      if(href.includes("&search"))href=href.replace(/&search=[^&]*/,"");
      if(serviceName!="")href+=`&search=${serviceName}`;
      if(href.includes("&category"))href=href.replace(/&category=[^&]*/,"");
      if(category!="" && category!="all")href+=`&category=${category}`;
      this.serviceService.getServicesPagination(href)?.subscribe();  
    }
  }

  showAddBarber(){
    this.router.navigateByUrl("/home/tabs/service/details/0");
  }

  ngOnDestroy(): void {
    if(this.servicesSub)this.servicesSub.unsubscribe();
    if(this.categoriesSub)this.categoriesSub.unsubscribe();
  }

  onEnter($event: Event,serviceName: string,category: string) {
    this.filterServices(serviceName,category);
  }
    
  onInput($event: IonInputCustomEvent<InputInputEventDetail>) {
    this.noServicesMessage=false;
  }

  changeCategory(serviceName: string,category: string) {
    this.selectedCategory=category;
    this.filterServices(serviceName,category);
    this.selectedPage=1;
  }

  changePage(page:number){
    this.showSpinner=true;
    const link=this.services.Links.find((link)=>link.Rel=="curr");
    if(link){
      var href=link?.Href;
      href=href.replace(/pageNumber=[^&]*/,"pageNumber="+page);
      this.serviceService.getServicesPagination(href)?.subscribe();
      this.selectedPage=page;
    }
  }

}
