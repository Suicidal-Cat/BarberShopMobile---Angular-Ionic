import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/Account/account.service';

export const adminAuthorizationGuard: CanActivateFn = (route, state) => {

  const accountService = inject(AccountService);
  const router = inject(Router);
  const user=accountService.getUser();

  if(user?.Role=="Admin")return true;
  else return router.navigateByUrl("/home");
};
