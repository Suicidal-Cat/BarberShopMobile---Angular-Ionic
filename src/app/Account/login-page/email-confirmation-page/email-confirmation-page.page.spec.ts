import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailConfirmationPagePage } from './email-confirmation-page.page';

describe('EmailConfirmationPagePage', () => {
  let component: EmailConfirmationPagePage;
  let fixture: ComponentFixture<EmailConfirmationPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailConfirmationPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
