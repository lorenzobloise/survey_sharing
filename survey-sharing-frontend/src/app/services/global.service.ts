import { Injectable } from "@angular/core";
import { User } from "../entities/user";
import { Survey } from "../entities/survey";
import { Answer } from "../entities/answer";
import { Invitation } from "../entities/invitation";
import { Router } from "@angular/router";
import { UserService } from "./api/user.service";
import { SurveyService } from "./api/survey.service";
import { InvitationService } from "./api/invitation.service";
import { QuestionService } from "./api/question.service";
import { StatisticsService } from "./api/statistics.service";
import { ImageService } from "./api/image.service";
import { DomSanitizer } from "@angular/platform-browser";
import { NbThemeService } from "@nebular/theme";
import { AnswerService } from "./api/answer.service";
import { BehaviorSubject } from "rxjs";
import { TokenService } from "./auth/token.service";

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  private usernameSubject = new BehaviorSubject<string|null>(null);
  username$ = this.usernameSubject.asObservable();
  private userSubject = new BehaviorSubject<User|null>(null);
  user$ = this.userSubject.asObservable();
  private createdSurveysSubject = new BehaviorSubject<Survey[]|null>(null);
  createdSurveys$ = this.createdSurveysSubject.asObservable();
  private answersSubject = new BehaviorSubject<{answer: Answer, surveyOwner: User}[]|null>(null);
  answers$ = this.answersSubject.asObservable();
  private averageRatingsSubject = new BehaviorSubject<{surveyTitle: string, averageRating: number}[]|null>(null);
  averageRatings$ = this.averageRatingsSubject.asObservable();
  private invitationsSubject = new BehaviorSubject<{invitation: Invitation, surveyOwner: User, survey: Survey}[]|null>(null);
  invitations$ = this.invitationsSubject.asObservable();
  private searchTypeSubject = new BehaviorSubject<string|null>(null);
  searchType$ = this.searchTypeSubject.asObservable();
  private querySubject = new BehaviorSubject<string|null>(null);
  query$ = this.querySubject.asObservable();
  private refreshSubject = new BehaviorSubject<boolean|null>(null);
  refresh$ = this.refreshSubject.asObservable();
  private darkModeSubject = new BehaviorSubject<boolean|null>(null);
  darkMode$ = this.darkModeSubject.asObservable();

  constructor(public router: Router, public userService: UserService, public surveyService: SurveyService,
    public answerService: AnswerService, public invitationService: InvitationService,
    public statisticsService: StatisticsService, public questionService: QuestionService,
    public imageService: ImageService, public themeService: NbThemeService,
    public sanitizer: DomSanitizer, private tokenService: TokenService){
      this.usernameSubject.next("");
      this.userSubject.next(new User("","","","","",-1,"","",[]));
      this.createdSurveysSubject.next([]);
      this.answersSubject.next([]);
      this.averageRatingsSubject.next([]);
      this.invitationsSubject.next([]);
      this.searchTypeSubject.next("");
      this.querySubject.next("");
      this.refreshSubject.next(false);
      this.darkModeSubject.next(false);
  }

  initialize(): void {
    this.setUsername(localStorage.getItem('username') as string);
    this.fetchUser();
    this.fetchCreatedSurveys();
    this.fetchAnswers();
    this.fetchInvitations();
  }

  themeCheck(): void {
    const theme: string | null = localStorage.getItem('theme');
    if(theme!=null){
      this.themeService.changeTheme(theme);
      if(theme=='default')
        this.setDarkMode(false);
      else
      this.setDarkMode(true);
    }
  }

  switchTheme(){
    if(this.getDarkMode()){
      this.themeService.changeTheme('dark');
      localStorage.setItem('theme','dark');
    }
    else{
      this.themeService.changeTheme('default');
      localStorage.setItem('theme','default');
    }
  }

  navigate(route: string, parameters: string | null){
    this.setRefresh(true);
    if(parameters==null)
      this.router.navigate([route]);
    else
      this.router.navigate([route, parameters]);
  }

  reloadWindow(){
    if(this.getRefresh()){
      this.setRefresh(false);
      window.location.reload();
    }
  }

  getUsername(): string | null {
    return this.usernameSubject.value;
  }

  setUsername(username: string): void {
    this.usernameSubject.next(username);
  }

  fetchUser(): void {
    this.userService.findUserByUsername(this.getUsername() as string).subscribe(responseMessage => {
      this.userSubject.next(responseMessage.object);
    })
  }

  getUser(): User{
    const result = this.userSubject.value;
    if(result!=null)
      return result;
    return new User("","","","","",-1,"","",[]);
  }

  fetchCreatedSurveys(): void {
    this.surveyService.findAllCreatedSurveys(true).subscribe(responseMessage => {
      if(responseMessage.object){
        this.createdSurveysSubject.next(responseMessage.object);
        const createdSurveys = this.getCreatedSurveys();
        if(createdSurveys){
          createdSurveys.forEach(s => {
            const surveyTitle: string = s.title;
            this.statisticsService.computeAverageRating(surveyTitle).subscribe(responseMessage => {
              if(responseMessage.object){
                this.getAverageRatings().push({surveyTitle: surveyTitle, averageRating: responseMessage.object});
              }
            })
          })
        }
      }
    })
  }

  getCreatedSurveys(): Survey[] {
    const result = this.createdSurveysSubject.value;
    if(result!=null)
      return result;
    return [];
  }

  fetchAnswers(): void {
    this.answerService.findAllAnswers().subscribe(responseMessage => {
      var result: Answer[] = responseMessage.object;
      if(result!=null && result.length>0)
        result.forEach(answer => {
          this.surveyService.findSurveyByTitle(answer.survey, true).subscribe(responseMessage2 => {
            if(responseMessage2.object)
              this.userService.findUserByUsername(responseMessage2.object.owner).subscribe(responseMessage3 => {
                if(responseMessage3.object)
                  this.getAnswers().push({answer: answer, surveyOwner: responseMessage3.object});
              })
          })
        })
    })
  }

  getAnswers(): {answer: Answer, surveyOwner: User}[] {
    const result = this.answersSubject.value;
    if(result!=null)
      return result;
    return [];
  }

  fetchInvitations(): void {
    this.invitationService.findAllInvitations().subscribe(responseMessage => {
      var result: Invitation[] = responseMessage.object;
      if(result!=null && result.length>0)
        result.forEach(invitation => {
          this.surveyService.findSurveyByTitle(invitation.survey, true).subscribe(responseMessage2 => {
            if(responseMessage2.object)
              this.userService.findUserByUsername(responseMessage2.object.owner).subscribe(responseMessage3 => {
                if(responseMessage3.object)
                  this.getInvitations().push({invitation: invitation, surveyOwner: responseMessage3.object, survey: responseMessage2.object});
              })
          })
        })
    })
  }

  getInvitations(): {invitation: Invitation, surveyOwner: User, survey: Survey}[] {
    const result = this.invitationsSubject.value;
    if(result!=null)
      return result;
    return [];
  }

  getAverageRatings(){
    const result = this.averageRatingsSubject.value;
    if(result!=null)
      return result;
    return [];
  }

  getSearchType(): string | null {
    return this.searchTypeSubject.value;
  }

  setSearchType(searchType: string): void {
    this.searchTypeSubject.next(searchType);
  }

  getQuery(): string | null {
    return this.querySubject.value;
  }

  setQuery(query: string): void {
    this.querySubject.next(query);
  }

  getDarkMode(): boolean | null {
    return this.darkModeSubject.value;
  }

  setDarkMode(darkMode: boolean): void {
    this.darkModeSubject.next(darkMode);
  }

  getRefresh(): boolean | null {
    return this.refreshSubject.value;
  }

  setRefresh(refresh: boolean): void {
    this.refreshSubject.next(refresh);
  }

  getParsedDate(date: string[] | undefined): string | null {
    if(date!=undefined)
      return date[0]+'/'+date[1]+'/'+date[2];
    return null;
  }

  getParsedHour(date: string[] | undefined): string | null {
    if(date!=undefined)
      return date[3]+':'+date[4]+':'+date[5];
    return null;
  }

  compareDates(date1: string[], date2: string[]): number {
    if(date1[2]<date2[2]) return -1;
    if(date1[2]>date2[2]) return 1;
    if(date1[1]<date2[1]) return -1;
    if(date1[1]>date2[1]) return 1;
    if(date1[0]<date2[0]) return -1;
    if(date1[0]>date2[0]) return 1;
    if(date1[3]<date2[3]) return -1;
    if(date1[3]>date2[3]) return 1;
    if(date1[4]<date2[4]) return -1;
    if(date1[4]>date2[4]) return 1;
    if(date1[5]<date2[5]) return -1;
    if(date1[5]>date2[5]) return 1;
    return 0;
  }

  getImageMimeType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      default:
        throw new Error('Image format not supported');
    }
  }

  logout(){
    localStorage.setItem('loggedIn', 'false');
    this.tokenService.token = '';
    this.themeService.changeTheme('default');
    localStorage.setItem('theme','default');
    this.navigate('login', null);
  }
}
