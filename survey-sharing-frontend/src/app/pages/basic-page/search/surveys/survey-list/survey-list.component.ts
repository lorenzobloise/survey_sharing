import { Component, OnInit } from '@angular/core';
import { Survey } from 'src/app/entities/survey';
import { User } from 'src/app/entities/user';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-survey-list',
  templateUrl: './survey-list.component.html',
  styleUrls: ['./survey-list.component.scss']
})
export class SurveyListComponent implements OnInit {

  private query!: string | null;
  public search_results: Survey[] = [];
  public owners_details: Map<string, User> = new Map<string, User>();

  constructor(public globalService: GlobalService) { }

  ngOnInit(): void {
    this.globalService.reloadWindow();
    this.query = localStorage.getItem('query');
    this.search_results = [];
    if(this.query==null || this.query===""){
      this.globalService.surveyService.findAllSurveys(false).subscribe(responseMessage => {
        this.search_results = responseMessage.object;
        if(this.search_results.length==0) alert (responseMessage.message);
        this.search_results.forEach(survey => {
          this.findOwnerDetails(survey.owner);
        })
      })
    }
    else{
      this.globalService.surveyService.findSurveysByTitle(this.query, false).subscribe(responseMessage => {
        this.search_results = responseMessage.object;
        if(this.search_results.length==0) alert (responseMessage.message);
        this.search_results.forEach(survey => {
          this.findOwnerDetails(survey.owner);
        })
      })
    }
  }

  findOwnerDetails(owner: string) {
    if(!this.owners_details.has(owner)){
      this.globalService.userService.findUsersByUsername(owner).subscribe(responseMessage => {
        if(responseMessage.object.length==0)
          alert (responseMessage.message);
        else
          this.owners_details.set(owner, responseMessage.object[0]);
      })
    }
  }

  answerSurvey(survey: string){
    this.globalService.navigate('home/answer', survey);
  }

  hasAnswered(survey: string): boolean {
    return this.globalService.getAnswers().find(a => a.answer.survey==survey)!=undefined;
  }

  getTooltip(survey: string): string {
    if(this.hasAnswered(survey))
      return "You have already answered this survey";
    return "";
  }

}
