import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { RegistrationRequest } from "../../entities/auth/registration-request";
import { ResponseMessage } from "../../support/response-message";
import { AuthenticationRequest } from "../../entities/auth/authentication-request";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private path = 'auth'

  constructor(@Inject('BASE_URL') private BASE_URL: string, private httpClient:HttpClient){}

  public register(request: RegistrationRequest){
    return this.httpClient.post<ResponseMessage>(this.BASE_URL+this.path+'/register',request);
  }

  public authenticate(request: AuthenticationRequest){
    return this.httpClient.post<ResponseMessage>(this.BASE_URL+this.path+'/authenticate',request);
  }

}
