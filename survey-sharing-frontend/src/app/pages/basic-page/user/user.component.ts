import { Component, OnInit } from '@angular/core';
import { Invitation } from 'src/app/entities/invitation';
import { Survey } from 'src/app/entities/survey';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(public globalService: GlobalService) { }

  ngOnInit(): void {
    this.globalService.reloadWindow();
  }

  goToSurveyDetailsPage(surveyTitle: string){
    this.globalService.navigate('home/survey-details', surveyTitle);
  }

  deleteCreatedSurvey(surveyTitle: string){
    this.globalService.surveyService.deleteCreatedSurvey(surveyTitle).subscribe(responseMessage => {
      alert(responseMessage.message);
      window.location.reload();
    })
  }

  deleteInvitation(invitation: string){
    this.globalService.invitationService.deleteInvitation(invitation).subscribe(responseMessage => {
      alert(responseMessage.message);
      window.location.reload();
    })
  }

  deleteAnswer(answer: string){
    this.globalService.answerService.deleteAnswer(answer).subscribe(responseMessage => {
      alert(responseMessage.message);
      window.location.reload();
    })
  }

  goToAnswerDetailsPage(survey: string){
    this.globalService.navigate('home/answer-details', survey);
  }

  answerSurvey(survey: string){
    this.globalService.navigate('home/answer', survey);
  }

  surveyAnsweredOrClosed(survey: Survey): boolean {
    return this.surveyAnswered(survey.title) || survey.closed;
  }

  surveyAnswered(survey: string): boolean {
    const answerFound = this.globalService.getAnswers().find(a => a.answer.survey==survey);
    return answerFound!=undefined;
  }

  getTooltip(survey: Survey, invitation: Invitation): string {
    if(survey.closed)
      return "This survey is closed";
    if(this.surveyAnswered(invitation.survey))
      return "You have already answered this survey";
    return "";
  }

  getAverageRating(surveyTitle: string): number {
    const result: {surveyTitle: string, averageRating: number} | undefined = this.globalService.getAverageRatings().find(x => x.surveyTitle==surveyTitle);
    if(result!=undefined)
      return result.averageRating;
    else
      return 0;
  }

}
