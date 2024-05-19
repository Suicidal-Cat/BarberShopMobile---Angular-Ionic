
import { CanMatchFn, Router } from '@angular/router';
import { AccountService } from '../services/Account/account.service';
import { inject } from '@angular/core';

export const authenticationGuard: CanMatchFn = (route, segments) => {
  const accountService = inject(AccountService);
  const router = inject(Router);
  if(accountService.isAuthenticated())return true;
  else {
    // router.navigateByUrl("/login");
    accountService.logout();
    return false;
  }
};
