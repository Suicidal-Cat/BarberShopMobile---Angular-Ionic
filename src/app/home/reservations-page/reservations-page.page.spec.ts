import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReservationsPagePage } from './reservations-page.page';

describe('ReservationsPagePage', () => {
  let component: ReservationsPagePage;
  let fixture: ComponentFixture<ReservationsPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationsPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
