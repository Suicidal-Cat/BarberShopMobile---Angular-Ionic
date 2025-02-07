import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ViewWillEnter } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Link } from 'src/app/models/Hateoas/Link';
import { LinkCollection } from 'src/app/models/Hateoas/LinkCollection';
import { ServiceCategory } from 'src/app/models/ServiceCategory/serviceCategory';
import { Service } from 'src/app/models/ServiceD/service';
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
  showDeleteSpinner:boolean=false;
  ServiceId!:string | null;
  Name:string="";
  Price:number=1;
  Duration:number=1;
  ServiceCategory:number=0;
  UpdateLink!:Link | undefined;
  DeleteLink!:Link | undefined;
  title:string="Create service";


  constructor(private serviceService:ServiceService,
    private navCotroller:NavController,private route:ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap=>{
      this.ServiceId=paramMap.get("serviceId");
      if(this.ServiceId=="0"){
        this.title="Create a service";
        return;
      }
      else this.title="Update a service";

      const link=this.serviceService.getServiceLink();
      if(!paramMap.has("serviceId") || link==undefined){
        this.navCotroller.navigateBack("/home/tabs/service")
        return;
      }
      
      if(link!=undefined)this.serviceService.getService(link).subscribe(
        (data)=>{
          this.Name=data.Value.Name;
          this.Price=data.Value.Price;
          this.Duration=data.Value.Duration;
          this.ServiceCategory=data.Value.ServiceCategory.Id;
          this.serviceService.setServiceLink(undefined);
          this.UpdateLink=data.Links.find((link)=>link.Rel=="update");
          this.DeleteLink=data.Links.find((link)=>link.Rel=="delete");
        }
      )


    })


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
    if(this.UpdateLink!=undefined && this.ServiceId!="0"){
      serviceForm.value.ServiceId=this.ServiceId;
      this.serviceService.updateService(serviceForm.value,this.UpdateLink).subscribe({
        next:()=>{
          this.showSpinner=false;
          this.navCotroller.navigateBack("/home/tabs/service")
        },
        error(err) {
        }
        })
    }
    else
    {
      this.serviceService.addService(serviceForm.value)?.subscribe({
        next:()=>{
          this.showSpinner=false;
          this.navCotroller.navigateBack("/home/tabs/service")
        },
        error(err) {  
        },
      })
    }

  }

  deleteService(){
    if(this.ServiceId){
      this.showDeleteSpinner=true;
      const id=parseInt(this.ServiceId);
  
      if(this.DeleteLink)this.serviceService.deleteService(this.DeleteLink,id).subscribe({
        next:()=>{
          this.showDeleteSpinner=false;
          this.navCotroller.navigateBack("/home/tabs/service")
        },
        error:()=>{
          this.showDeleteSpinner=false;
          this.navCotroller.navigateBack("/home/tabs/service")
        }
      });
    }
  }


  ngOnDestroy(): void {
    if(this.categoriesSub)this.categoriesSub.unsubscribe();
  }

  navigateBack(){
    this.navCotroller.navigateBack("home/tabs/service");
  }

  public alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
      },
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
        this.deleteService();
      },
    },
  ];

}
