import { Component, OnDestroy, OnInit } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
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
  selectedCategory!:string;

  constructor(private serviceService:ServiceService) { }

  ngOnInit() {
    this.servicesSub=this.serviceService.servicesPag.subscribe((services)=>{
      this.services=services;
      if(this.services.Links.find((link)=>link.Rel=="prev")!=undefined)this.prevPage=true;
      else this.prevPage=false;
      if(this.services.Links.find((link)=>link.Rel=="next")!=undefined)this.nextPage=true;
      else this.nextPage=false;
      const link=services.Links.find((link)=>link.Rel=="serviceCategories");
      if(link)this.serviceService.getServiceCategories(link).subscribe();
    })
    this.categoriesSub=this.serviceService.serviceCategories.subscribe((categories)=>{
      if(categories.length>0){
        this.serviceCategories=categories;
      }
    })
  }

  ionViewWillEnter(): void {
    this.serviceService.getServicesPagination()?.subscribe();
  }

  getPrevPage(){
    const link=this.services.Links.find((link)=>link.Rel=="prev");
    this.serviceService.getServicesPagination(link?.Href)?.subscribe();
  }
  getNextPage(){
    const link=this.services.Links.find((link)=>link.Rel=="next");
    this.serviceService.getServicesPagination(link?.Href)?.subscribe();
  }

  filterServices(serviceName:string="",category:string=""){
    const link=this.services.Links.find((link)=>link.Rel=="curr");
    if(link){
      var href=link?.Href;
      if(href.includes("&search"))href=href.replace(/&search=[^&]*/,"");
      if(serviceName!="")href+=`&search=${serviceName}`;
      if(href.includes("&category"))href=href.replace(/&category=[^&]*/,"");
      if(category!="" && category!="None")href+=`&category=${category}`;
      console.log(href)
      this.serviceService.getServicesPagination(href)?.subscribe();  
    }

  }

  ngOnDestroy(): void {
    if(this.servicesSub)this.servicesSub.unsubscribe();
    if(this.categoriesSub)this.categoriesSub.unsubscribe();
  }

}
