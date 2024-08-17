import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChooseServicesPagePage } from './choose-services-page.page';

describe('ChooseServicesPagePage', () => {
  let component: ChooseServicesPagePage;
  let fixture: ComponentFixture<ChooseServicesPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseServicesPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
