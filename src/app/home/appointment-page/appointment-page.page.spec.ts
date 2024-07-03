import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppointmentPagePage } from './appointment-page.page';

describe('AppointmentPagePage', () => {
  let component: AppointmentPagePage;
  let fixture: ComponentFixture<AppointmentPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
