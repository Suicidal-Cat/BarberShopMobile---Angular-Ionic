import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController, ViewWillEnter } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ServiceCategory } from 'src/app/models/ServiceCategory/serviceCategory';
import { ServiceService } from 'src/app/services/ServiceD/service.service';

@Component({
  selector: 'app-service-details',
  templateUrl: './service-details.page.html',
  styleUrls: ['./service-details.page.scss'],
})
export class ServiceDetailsPage implements OnInit,ViewWillEnter{

  serviceCategories:ServiceCategory[]=[];
  categoriesSub!:Subscription

  showSpinner:boolean=false;

  constructor(private serviceService:ServiceService,private navCtr:NavController) { }

  ngOnInit() {
    this.categoriesSub=this.serviceService.serviceCategories.subscribe((categories)=>{
      if(categories.length>0){
        this.serviceCategories=categories;
      }
    })
  }

  ionViewWillEnter(): void {
    this.serviceService.getServiceCategories()?.subscribe();
  }

  saveService(serviceForm:NgForm){
    serviceForm.value.ServiceCategory={Id:serviceForm.value.ServiceCategory,Name:null};
    this.showSpinner=true;
    this.serviceService.addService(serviceForm.value)?.subscribe({
      next:()=>{
        this.showSpinner=false;
        this.navCtr.navigateBack("/home/service")
      },
      error(err) {
        
      },
    })
  }


  ngOnDestroy(): void {
    if(this.categoriesSub)this.categoriesSub.unsubscribe();
  }

}
