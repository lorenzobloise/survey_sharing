import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { ResponseMessage } from "../../support/response-message";

@Injectable({
  providedIn: 'root'
})
export class QuestionService{

  private path = "questions";

  constructor(@Inject('BASE_URL') private BASE_URL: string, private http: HttpClient) { }

  // GET

  public findQuestionById(questionId: string){
    return this.http.get<ResponseMessage>(this.BASE_URL+this.path+'?questionId='+questionId);
  }

}
