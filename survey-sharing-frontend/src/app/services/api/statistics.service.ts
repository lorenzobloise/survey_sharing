import { Inject, Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { ResponseMessage } from "../../support/response-message";

@Injectable({
  providedIn: 'root'
})
export class StatisticsService{

  private path = "statistics";

  constructor(@Inject('BASE_URL') private BASE_URL: string, private http:HttpClient) { }

  // GET

  public computeStatistics(survey: string){
    return this.http.get<ResponseMessage>(this.BASE_URL+this.path+'?surveyTitle='+survey);
  }

  public computeAverageRating(survey: string){
    return this.http.get<ResponseMessage>(this.BASE_URL+this.path+'/averageRating?surveyTitle='+survey);
  }

}
