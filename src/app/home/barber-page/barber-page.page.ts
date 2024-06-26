import { Component, OnDestroy, OnInit } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Barber } from 'src/app/models/Barber/barber';
import { LinkCollection } from 'src/app/models/Hateoas/LinkCollection';
import { BarberService } from 'src/app/services/Barber/barber.service';

@Component({
  selector: 'app-barber-page',
  templateUrl: './barber-page.page.html',
  styleUrls: ['./barber-page.page.scss'],
})
export class BarberPagePage implements OnInit,ViewWillEnter,OnDestroy {

  barbers!:LinkCollection<LinkCollection<Barber>[]>;
  barberSub!: Subscription;

  nextPage:boolean=true;
  prevPage:boolean=false;

  constructor(private barberService:BarberService) { }

  ngOnInit() {
    this.barberSub=this.barberService.barbersPag.subscribe(
      (barbers)=>{
        this.barbers=barbers;
        if(this.barbers.Links.find((link)=>link.Rel=="prev")!=undefined)this.prevPage=true;
        else this.prevPage=false;
        if(this.barbers.Links.find((link)=>link.Rel=="next")!=undefined)this.nextPage=true;
        else this.nextPage=false;
      })
  }

  ionViewWillEnter(): void {
    this.barberService.getBarbersPagination()?.subscribe();
  }

  getPrevPage(){
    const link=this.barbers.Links.find((link)=>link.Rel=="prev");
    this.barberService.getBarbersPagination(link?.Href)?.subscribe();
  }
  getNextPage(){
    const link=this.barbers.Links.find((link)=>link.Rel=="next");
    this.barberService.getBarbersPagination(link?.Href)?.subscribe();
  }

  filterServices(barberName:string=""){
    const link=this.barbers.Links.find((link)=>link.Rel=="curr");
    if(link){
      var href=link?.Href;
      href=href.replace(/pageNumber=[^&]*/,"$pageNumber=1");
      if(href.includes("&search"))href=href.replace(/&search=[^&]*/,"");
      if(barberName!="")href+=`&search=${barberName}`;
      this.barberService.getBarbersPagination(href)?.subscribe();  
    }
  }



  ngOnDestroy(): void {
    if(this.barberSub)this.barberSub.unsubscribe();
  }

}
