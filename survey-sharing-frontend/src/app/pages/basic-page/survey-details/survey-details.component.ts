import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbWindowService } from '@nebular/theme';
import { Invitation } from 'src/app/entities/invitation';
import { Option } from 'src/app/entities/option';
import { MultipleChoiceQuestion, Question } from 'src/app/entities/question';
import { Survey } from 'src/app/entities/survey';
import { User } from 'src/app/entities/user';
import { InvitationComponent } from '../invitation/invitation.component';
import { Answer } from 'src/app/entities/answer';
import { Statistics } from 'src/app/entities/statistics';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-survey-details',
  templateUrl: './survey-details.component.html',
  styleUrls: ['./survey-details.component.scss']
})
export class SurveyDetailsComponent implements OnInit {

  survey!: Survey;
  ownerDetails!: User;
  questions: { id: string, question: Question}[] = [];
  invitations: { id: string, invitation: Invitation, recipient: User }[] = [];
  answers: { id: string, answer: Answer, user: User }[] = [];
  answerCount: { question: string, answers: string[], count: number[] }[] = [];
  feedbacks: { id: string, answer: Answer, user: User }[] = [];
  statistics!: Statistics;
  nullVariable: null = null;

  constructor(public globalService: GlobalService, private route: ActivatedRoute, private windowService: NbWindowService) {}

  ngOnInit(): void {
    this.globalService.reloadWindow();
    var surveyTitle = this.route.snapshot.paramMap.get('surveyTitle');
    if(surveyTitle!=null){
      this.globalService.surveyService.findSurveyByTitle(surveyTitle, true).subscribe(responseMessage => {
        if(responseMessage.object!=null){
          this.survey = responseMessage.object;
          this.globalService.userService.findUsersByUsername(this.survey.owner).subscribe(responseMessage2 => {
            if(responseMessage2.object!=null && responseMessage2.object.length>0)
              this.ownerDetails = responseMessage2.object[0];
            else
              alert(responseMessage.message);
          })
          this.survey.questions.forEach(q => {
            this.globalService.questionService.findQuestionById(q).subscribe(responseMessage2 => {
              if(responseMessage2.object!=null && !this.questions.find(x => x.id==q)){
                this.questions.push({ id: q, question: responseMessage2.object });
                this.questions.sort((x,y) => {
                  if(x.id < y.id) return -1;
                  if(x.id > y.id) return 1;
                  return 0;
                })
              }
              else
                alert(responseMessage.message);
            })
          })
          this.survey.invitations.forEach(i => {
            this.globalService.invitationService.findInvitationById(i).subscribe(responseMessage2 => {
              if(responseMessage2.object!=null && !this.invitations.find(x => x.id==i)){
                this.globalService.userService.findUsersByUsername(responseMessage2.object.user).subscribe(responseMessage3 => {
                  if(responseMessage3.object!=null && responseMessage3.object.length>0){
                    this.invitations.push({ id: i, invitation: responseMessage2.object, recipient: responseMessage3.object[0] });
                    this.invitations.sort((i1, i2) => { return this.globalService.compareDates(i2.invitation.invitationDate, i1.invitation.invitationDate) });
                  }
                })
              }
            })
          })
          this.survey.answers.forEach(a => {
            this.globalService.answerService.findAnswerById(a).subscribe(responseMessage2 => {
              if(responseMessage2.object!=null){
                const currAnswer: Answer = responseMessage2.object;
                this.globalService.userService.findUserByUsername(currAnswer.user).subscribe(responseMessage3 => {
                  if(responseMessage3.object!=null){
                    const currUser: User = responseMessage3.object;
                    this.answers.push({id: currAnswer.id, answer: currAnswer, user: currUser});
                    this.answers.sort((a1, a2) => { return this.globalService.compareDates(a1.answer.answerDate, a2.answer.answerDate) });
                  }
                })
                currAnswer.questions.forEach(q => {
                  this.globalService.questionService.findQuestionById(q).subscribe(responseMessage3 => {
                    if(responseMessage3.object!=null && this.isMultipleChoice(responseMessage3.object)){
                      const currQuestion: Question = responseMessage3.object;
                      const currOptions: Option[] | null = this.getOptions(currQuestion);
                      if(currOptions!=null){
                        const optionsString: string[] = [];
                        currOptions.forEach(o => optionsString.push(o.option));
                        const selected: number = currOptions.findIndex(o => o.selected==true);
                        if(selected!=-1){
                          const index: number = this.answerCount.findIndex(x => x.question==currQuestion.question);
                          if(index==-1){
                            var countOptions: number[] = [];
                            currOptions.forEach(_ => countOptions.push(0));
                            countOptions[selected]++;
                            this.answerCount.push({question: currQuestion.question, answers: optionsString, count: countOptions});
                          }
                          else{
                            this.answerCount[index].count[selected]++;
                          }
                        }
                      }
                    }
                  })
                });
              }
            })
          })
          this.globalService.statisticsService.computeStatistics(this.survey.title).subscribe(responseMessage2 => {
            if(responseMessage2.object){
              this.statistics = responseMessage2.object;
            }
          })
        }
        else
          alert(responseMessage.message);
      })
    }
  }

  getOwnerDetails(): User{
    if(this.ownerDetails!=undefined)
      return this.ownerDetails;
    return new User("","","","","",-1,"","",[]);
  }

  getSurvey(): Survey{
    if(this.survey!=undefined)
      return this.survey;
    return new Survey("","","",false,[],[],[],[],[]);
  }

  getQuestion(question: string): Question{
    const result = this.questions.find(x => x.id==question)?.question;
    if(result != undefined && result != null)
      return result;
    return new Question();
  }

  isMultipleChoice(question: Question): boolean{
    return question.type=='MultipleChoiceQuestion';
  }

  isOpenEnded(question: Question): boolean{
    return question.type=='OpenEndedQuestion';
  }

  isImage(question: Question): boolean{
    return question.type=='ImageQuestion';
  }

  getOptions(question: Question): Option[] | null{
    if(question.type=='MultipleChoiceQuestion'){
      const mcq: MultipleChoiceQuestion = question as MultipleChoiceQuestion;
      return mcq.options;
    }
    return null;
  }

  getTooltip(survey: Survey): string {
    if(survey.closed)
      return "This survey is already closed";
    return "";
  }

  closeSurvey(surveyTitle: string){
    this.globalService.surveyService.closeSurvey(surveyTitle).subscribe(responseMessage => {
      alert(responseMessage.message);
      window.location.reload();
    })
  }

  deleteSurvey(surveyTitle: string){
    this.globalService.surveyService.deleteCreatedSurvey(surveyTitle).subscribe(responseMessage => {
      alert(responseMessage.message);
      this.globalService.navigate('home/user', null);
    })
  }

  goToAnswerSummaryPage(answer: Answer){
    this.globalService.navigate('home/answer-summary', answer.id);
  }

  getInvitationAcceptedIcon(invitation: Invitation){
    switch(invitation.accepted){
      case true:
        return 'checkmark-circle-2'
      case false:
        return 'close-circle'
      default:
        return ''
    }
  }

  getInvitationAcceptedStatus(invitation: Invitation){
    switch(invitation.accepted){
      case true:
        return 'success'
      case false:
        return 'danger'
      default:
        return ''
    }
  }

  openInvitationWindow(){
    localStorage.setItem('surveyTitle', this.survey.title);
    this.windowService.open(InvitationComponent,
      { title: 'Invite other users to answer your survey', windowClass: 'custom-window' });
  }

  deleteInvitation(invitation: string){
    this.globalService.invitationService.deleteInvitation(invitation).subscribe(ResponseMessage => {
      alert(ResponseMessage.message);
      window.location.reload();
    })
  }

  getRating(answer: Answer): number {
    if(answer.rating)
      return answer.rating as number;
    return 0;
  }

  getStatistics(): Statistics {
    if(this.statistics)
      return this.statistics;
    return new Statistics("",this.getSurvey().title, -1, -1, -1, [], -1, -1, [], -1, -1, -1, [], -1, -1, -1, -1, [], -1);
  }

  getDistribution(data: number[], categories: number[], type: string): number[] {
    var support: {category: number, count: number}[] = [];
    var distribution: number[] = [];
    categories.forEach(c => {
      support.push({category: c, count: 0});
      distribution.push(0);
    });
    data.forEach(d => {
      const entry: {category: number, count: number} | undefined = support.find(x => x.category==d);
      if(entry!=undefined) entry.count++;
    })
    if(type=='Ratings')
      support.forEach(x => distribution[x.category-1]=x.count);
    if(type=='Age'){
      const minValue: number = Math.min(...data as number[]);
      support.forEach(x => distribution[x.category-minValue]=x.count);
    }
    return distribution;
  }

  linspace(data: number[]): {numberArray: number[], stringArray: string[]} {
    const minValue: number = Math.min(...data);
    const maxValue: number = Math.max(...data);
    var numberArray: number[] = [];
    var stringArray: string[] = [];
    for(let i=minValue; i<=maxValue; i++){
      numberArray.push(i);
      stringArray.push(i+'');
    }
    return {numberArray: numberArray, stringArray: stringArray};
  }

  getDistributionCountries(data: string[], categories: string[]): number[] {
    var result: number[] = [];
    var support: {name: string, value: number}[] = [];
    categories.forEach(c => {
      support.push({name: c, value: 0});
    });
    data.forEach(d => {
      const index: number | undefined = support.findIndex(x => x.name==d);
      if(index!=undefined)
        support[index].value++;
    })
    support.forEach(x => {
      result.push(x.value);
    })
    return result;
  }

  getCountries(data: string[]): string[] {
    var result: string[] = [];
    data.forEach(d => {
      if(!result.find(x => x==d))
        result.push(d);
    })
    result.sort();
    return result;
  }

  getFeedbackIcon(sentiment: string): string {
    switch(sentiment){
      case 'POSITIVE':
        return 'checkmark-circle-2';
      case 'NEGATIVE':
        return 'close-circle';
      case 'MIXED':
        return 'alert-circle';
      case 'NEUTRAL':
        return 'question-mark-circle';
      default:
        return '';
    }
  }

  getFeedbackStatus(sentiment: string): string {
    switch(sentiment){
      case 'POSITIVE':
        return 'success';
      case 'NEGATIVE':
        return 'danger';
      case 'MIXED':
        return 'warning';
      case 'NEUTRAL':
        return 'info';
      default:
        return '';
    }
  }

  getAnswersOverTime(): number[] {
    const answersTimeAxis: string[] = this.getAnswersTimeAxis();
    var result: number[] = [];
    for(let i=0; i<answersTimeAxis.length-1; i++)
      result.push(i);
    if(this.getSurvey().closingDate!=null)
      result[answersTimeAxis.length-1] = result[answersTimeAxis.length-2];
    else
      result[answersTimeAxis.length-1] = answersTimeAxis.length-1;
    return result;
  }

  getAnswersTimeAxis(): string[] {
    const surveyCreationDate: string[] = this.getSurvey().creationDate;
    const surveyClosingDate: string[] = this.getSurvey().closingDate;
    const t_0: string = this.globalService.getParsedDate(surveyCreationDate)+"\n"+this.globalService.getParsedHour(surveyCreationDate);
    var result: string[] = [t_0];
    this.answers.forEach(a => {
      const answerDate: string[] = a.answer.answerDate;
      const t_i: string = this.globalService.getParsedDate(answerDate)+"\n"+this.globalService.getParsedHour(answerDate);
      result.push(t_i);
    })
    if(surveyClosingDate!=null){
      const t_end: string = this.globalService.getParsedDate(surveyClosingDate)+"\n"+this.globalService.getParsedHour(surveyClosingDate);
      result.push(t_end);
    }
    return result;
  }

  getAverageRatingOverTime(): number[] {
    const answersTimeAxis: string[] = this.getAnswersTimeAxis();
    var result: number[] = [];
    var partial: number = 0;
    var nonNull: number = 0;
    result.push(partial);
    const answersList: Answer[] = [];
    this.answers.forEach(a => answersList.push(a.answer));
    for(let i=0; i<answersList.length; i++){
      if(answersList[i].rating==0){
        const lastIndex: number = result.length-1;
        const lastValue: number = result[lastIndex];
        result.push(lastValue);
      }
      else{
        const currRating: number = answersList[i].rating as number;
        nonNull++;
        partial += currRating;
        result.push(partial/nonNull);
      }
    }
    if(this.getSurvey().closingDate!=null){
      const lastIndex: number = result.length-1;
      const lastValue: number = result[lastIndex];
      result.push(lastValue);
    }
    return result;
  }

}
