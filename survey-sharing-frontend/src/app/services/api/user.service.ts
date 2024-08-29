import { Inject, Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { ResponseMessage } from "../../support/response-message";

@Injectable({
  providedIn: 'root'
})
export class UserService{

  private path = "users";

  constructor(@Inject('BASE_URL') private BASE_URL: string, private http:HttpClient) { }

  // GET

  public findAllUsers(){
    return this.http.get<ResponseMessage>(this.BASE_URL+this.path+'/search/all');
  }

  public findUsersByFirstnameAndLastname(query: string){
    return this.http.get<ResponseMessage>(this.BASE_URL+this.path+'/search/by_firstname_lastname?query='+query);
  }

  public findUsersByEmail(email: string){
    return this.http.get<ResponseMessage>(this.BASE_URL+this.path+'/search/by_email?email='+email);
  }

  public findUserByEmail(email: string){
    return this.http.get<ResponseMessage>(this.BASE_URL+this.path+'/search/single/by_email?email='+email);
  }

  public findUserById(id: string){
    return this.http.get<ResponseMessage>(this.BASE_URL+this.path+'/search/by_id?id='+id);
  }

  public findUsersByUsername(username: string){
    return this.http.get<ResponseMessage>(this.BASE_URL+this.path+'/search/by_username?username='+username);
  }

  public findUserByUsername(username: string){
    return this.http.get<ResponseMessage>(this.BASE_URL+this.path+'/search/single/by_username?username='+username);
  }

  // DELETE

  public deleteUser(user: string){ //user = username or email
    return this.http.delete<ResponseMessage>(this.BASE_URL+this.path+'?user='+user);
  }

}
