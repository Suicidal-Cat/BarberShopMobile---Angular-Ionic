import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppointmentDatePagePage } from './appointment-date-page.page';

describe('AppointmentDatePagePage', () => {
  let component: AppointmentDatePagePage;
  let fixture: ComponentFixture<AppointmentDatePagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentDatePagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
