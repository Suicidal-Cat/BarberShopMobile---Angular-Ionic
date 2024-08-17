import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChooseBarbersPagePage } from './choose-barbers-page.page';

describe('ChooseBarbersPagePage', () => {
  let component: ChooseBarbersPagePage;
  let fixture: ComponentFixture<ChooseBarbersPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseBarbersPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
