import { Component, OnDestroy, OnInit } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { LinkCollection } from 'src/app/models/Hateoas/LinkCollection';
import { ServiceCategory } from 'src/app/models/ServiceCategory/serviceCategory';
import { Service } from 'src/app/models/ServiceD/service';
import { ServiceService } from 'src/app/services/ServiceD/service.service';

@Component({
  selector: 'app-appointment-page',
  templateUrl: './appointment-page.page.html',
  styleUrls: ['./appointment-page.page.scss'],
})
export class AppointmentPagePage implements OnInit, ViewWillEnter, OnDestroy {
  serviceCategories: ServiceCategory[] = [];
  services!: LinkCollection<LinkCollection<Service>[]>;
  categoriesSub!: Subscription;
  servicesSub!: Subscription;

  constructor(private serviceService: ServiceService) {}

  ngOnInit() {
    this.categoriesSub = this.serviceService.serviceCategories.subscribe((data) => {
        this.serviceCategories = data;}
    );
    this.servicesSub = this.serviceService.servicesPag.subscribe((services) => {
      this.services = services;
    });
  }

  ionViewWillEnter(): void {
    this.serviceService.getServiceCategories()?.subscribe();
    this.serviceService.getServices()?.subscribe();
  }

  ngOnDestroy(): void {
    if(this.servicesSub)this.servicesSub.unsubscribe();
    if (this.categoriesSub) this.categoriesSub.unsubscribe();
  }
}
