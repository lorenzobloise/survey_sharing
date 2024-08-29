import { Inject, Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { ResponseMessage } from "../../support/response-message";
import { Question } from "../../entities/question";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SurveyService{

  private path = "surveys";

  constructor(@Inject('BASE_URL') private BASE_URL: string, private http:HttpClient) { }

  // POST

  public createSurvey(surveyTitle: string, questions: string): Observable<ResponseMessage>{
    return this.http.post<ResponseMessage>(this.BASE_URL+this.path+'?surveyTitle='+surveyTitle,questions, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // GET

  public findAllSurveys(returnClosedSurveys: boolean): Observable<ResponseMessage>{
    return this.http.get<ResponseMessage>(this.BASE_URL+this.path+'/search?returnClosedSurveys='+returnClosedSurveys);
  }

  public findAllCreatedSurveys(returnClosedSurveys: boolean): Observable<ResponseMessage>{
    return this.http.get<ResponseMessage>(this.BASE_URL+this.path+'/all?returnClosedSurveys='+returnClosedSurveys);
  }

  public findAllSurveysByOwner(owner: string, returnClosedSurveys: boolean): Observable<ResponseMessage>{
    return this.http.get<ResponseMessage>(this.BASE_URL+this.path+'/search/by_owner?owner='+owner+'&returnClosedSurveys='+returnClosedSurveys);
  }

  public findSurveysByTitle(surveyTitle: string, returnClosedSurveys: boolean): Observable<ResponseMessage>{
    return this.http.get<ResponseMessage>(this.BASE_URL+this.path+'/search/by_title?surveyTitle='+surveyTitle+'&returnClosedSurveys='+returnClosedSurveys);
  }

  public findSurveyByTitle(surveyTitle: string, returnClosedSurveys: boolean): Observable<ResponseMessage>{
    return this.http.get<ResponseMessage>(this.BASE_URL+this.path+'/search/single/by_title?surveyTitle='+surveyTitle+'&returnClosedSurveys='+returnClosedSurveys);
  }

  // PUT

  public closeSurvey(surveyTitle: string): Observable<ResponseMessage>{
    return this.http.put<ResponseMessage>(this.BASE_URL+this.path+'?surveyTitle='+surveyTitle, null);
  }

  // DELETE

  public deleteCreatedSurvey(surveyTitle: string): Observable<ResponseMessage>{
    return this.http.delete<ResponseMessage>(this.BASE_URL+this.path+'?surveyTitle='+surveyTitle);
  }

}
