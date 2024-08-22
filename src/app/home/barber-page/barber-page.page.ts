import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import { IonInfiniteScrollCustomEvent } from '@ionic/core';
import { Subscription } from 'rxjs';
import { Barber } from 'src/app/models/Barber/barber';
import { LinkCollection } from 'src/app/models/Hateoas/LinkCollection';
import { BarberService } from 'src/app/services/Barber/barber.service';
import { OneDriveService } from 'src/app/services/one-drive.service';

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
  noBarbersMessage:boolean=false;
  maxPages:number=0;
  selectedPage:number=1;
  showSpinner:boolean=false;

  constructor(private barberService:BarberService,private router:Router) { }

  ngOnInit() {
    this.showSpinner=false;
    this.barberSub=this.barberService.barbersPag.subscribe(
      (barbers)=>{
        if(barbers.Value.length==0)this.noBarbersMessage=true;
        else this.noBarbersMessage=false;
        this.barbers=barbers;
        if(this.barbers.Links.find((link)=>link.Rel=="prev")!=undefined)this.prevPage=true;
        else this.prevPage=false;
        if(this.barbers.Links.find((link)=>link.Rel=="next")!=undefined)this.nextPage=true;
        else this.nextPage=false;
        if(this.barberService.MaxPages>0)this.maxPages=this.barberService.MaxPages;
        else this.maxPages=1;
        if(barbers.Value.length==0){
          this.showSpinner=false;
          this.maxPages=1;
        }
      })
  }

  ionViewWillEnter(): void {
    if(this.barbers.Value.length==0){
      this.showSpinner=true;
      this.barberService.getBarbersPagination()?.subscribe();
    }
  }

  getPrevPage(){
    if(this.selectedPage>1){
      this.showSpinner=true;
      this.barbers.Value=[];
      const link=this.barbers.Links.find((link)=>link.Rel=="prev");
      this.barberService.getBarbersPagination(link?.Href)?.subscribe();
      this.selectedPage=this.selectedPage-1;
    }
  }
  getNextPage(){
    if(this.selectedPage<this.maxPages){
      this.showSpinner=true;
      this.barbers.Value=[];
      const link=this.barbers.Links.find((link)=>link.Rel=="next");
      this.barberService.getBarbersPagination(link?.Href)?.subscribe();
      this.selectedPage=this.selectedPage+1;
    }
  }

  filterBarbers(barberName:string=""){
    this.showSpinner=true;
    this.barbers.Value=[];
    const link=this.barbers.Links.find((link)=>link.Rel=="curr");
    if(link){
      var href=link?.Href;
      href=href.replace(/pageNumber=[^&]*/,"pageNumber=1");
      if(href.includes("&search"))href=href.replace(/&search=[^&]*/,"");
      if(barberName!="")href+=`&search=${barberName}`;
      this.barberService.getBarbersPagination(href)?.subscribe();  
    }
  }

  onInput(event: Event) {
    this.noBarbersMessage=false;
  }

  onEnter(event: Event,barberName:string) {
    this.filterBarbers(barberName);
  }

  ngOnDestroy(): void {
    if(this.barberSub)this.barberSub.unsubscribe();
  }

  createBarberPage(){
    this.router.navigateByUrl("home/tabs/barber/details/0")
  }

  changePage(page:number){
    this.showSpinner=true;
    this.barbers.Value=[];
    const link=this.barbers.Links.find((link)=>link.Rel=="curr");
    if(link){
      var href=link?.Href;
      href=href.replace(/pageNumber=[^&]*/,"pageNumber="+page);
      this.barberService.getBarbersPagination(href)?.subscribe();
      this.selectedPage=page;
    }
  }
  
  picAreLoaded(){
    this.showSpinner=false;
  }

}
