import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordResetPagePage } from './password-reset-page.page';

describe('PasswordResetPagePage', () => {
  let component: PasswordResetPagePage;
  let fixture: ComponentFixture<PasswordResetPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordResetPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
