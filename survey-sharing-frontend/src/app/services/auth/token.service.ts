import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  set token(token: string) {
    localStorage.setItem('token', token)
  }

  get token() {
    return localStorage.getItem('token') as string;
  }

  isTokenNotValid(): boolean {
    return !this.isTokenValid();
  }

  private isTokenValid(): boolean {
    const token = this.token;
    if(!token)
      return false;
    // Decode the token
    const jwtHelper = new JwtHelperService();
    // Check the expiry date
    const isTokenExpired = jwtHelper.isTokenExpired(token);
    if(isTokenExpired){
      this.token = ''; // Clear the local storage
      return false;
    }
    return true;
  }

}
