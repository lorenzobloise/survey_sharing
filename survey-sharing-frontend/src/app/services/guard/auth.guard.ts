import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { TokenService } from '../auth/token.service';
import { GlobalService } from '../global.service';

export const authGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  const globalService = inject(GlobalService);
  if(tokenService.isTokenNotValid()){
    globalService.navigate('login',null);
    return false;
  }
  return true;
}
