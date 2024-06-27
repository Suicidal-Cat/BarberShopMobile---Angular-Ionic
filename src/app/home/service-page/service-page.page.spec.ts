import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServicePagePage } from './service-page.page';

describe('ServicePagePage', () => {
  let component: ServicePagePage;
  let fixture: ComponentFixture<ServicePagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicePagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
