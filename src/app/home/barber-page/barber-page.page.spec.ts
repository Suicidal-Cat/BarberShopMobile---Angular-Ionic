import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BarberPagePage } from './barber-page.page';

describe('BarberPagePage', () => {
  let component: BarberPagePage;
  let fixture: ComponentFixture<BarberPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BarberPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
