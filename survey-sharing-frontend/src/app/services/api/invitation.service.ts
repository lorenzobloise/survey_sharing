import { Inject, Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { ResponseMessage } from "../../support/response-message";
import { Invitation } from "../../entities/invitation";

@Injectable({
  providedIn: 'root'
})
export class InvitationService{

  private path = "invitations";

  constructor(@Inject('BASE_URL') private BASE_URL: string, private http:HttpClient) { }

  // POST

  public createInvitations(surveyTitle: string, invitations: Invitation[]){
    return this.http.post<ResponseMessage>(this.BASE_URL+this.path+'?surveyTitle='+surveyTitle,invitations);
  }

  // GET

  public findAllInvitations(){
    return this.http.get<ResponseMessage>(this.BASE_URL+this.path+'/search/all');
  }

  public findInvitationById(invitationId: string){
    return this.http.get<ResponseMessage>(this.BASE_URL+this.path+'/search/by_id?invitationId='+invitationId);
  }

  // DELETE

  public deleteInvitation(invitation: string){
    return this.http.delete<ResponseMessage>(this.BASE_URL+this.path+'?invitation='+invitation);
  }

  // PUT

  public updateInvitation(invitation: string, accepted: boolean){
    return this.http.put<ResponseMessage>(this.BASE_URL+this.path+'?invitation='+invitation+'&accepted='+accepted,null);
  }

}
