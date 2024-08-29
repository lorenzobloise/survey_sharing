import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormGroup, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbThemeModule, NbLayoutModule, NbSidebarModule, NbMenuModule, NbActionsModule, NbInputModule, NbCardModule, NbContextMenuModule, NbIconModule, NbSearchModule, NbSelectModule, NbToggleModule, NbButtonModule, NbFormFieldModule, NbStepperModule, NbListModule, NbUserModule, NbTabsetModule, NbBadgeModule, NbPopoverModule, NbPosition, NbRadioModule, NbTooltipModule, NbWindowModule, NbCheckboxModule, NbAccordionModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { LoginComponent } from './pages/login/login.component';
import { UserComponent } from './pages/basic-page/user/user.component';
import { SurveyListComponent } from './pages/basic-page/search/surveys/survey-list/survey-list.component';
import { AnswerComponent } from './pages/basic-page/search/surveys/answer/answer.component';
import { UserListComponent } from './pages/basic-page/search/users/user-list/user-list.component';
import { CreateSurveyComponent } from './pages/basic-page/create-survey/create-survey.component';
import { RegisterComponent } from './pages/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { SingleUserComponent } from './pages/basic-page/search/users/single-user/single-user.component';
import { SurveyDetailsComponent } from './pages/basic-page/survey-details/survey-details.component';
import { InvitationComponent } from './pages/basic-page/invitation/invitation.component';
import { AnswerDetailsComponent } from './pages/basic-page/answer-details/answer-details.component';
import { AnswerSummaryComponent } from './pages/basic-page/answer-summary/answer-summary.component';
import { NgbModule, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { RatingComponent } from './support/rating/rating.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { PieChartComponent } from './support/charts/pie-chart/pie-chart.component';
import { BarChartComponent } from './support/charts/bar-chart/bar-chart.component';
import { LineChartComponent } from './support/charts/line-chart/line-chart.component';
import { BasicPageComponent } from './pages/basic-page/basic-page.component';
import { HttpTokenInterceptor } from './services/interceptor/http-token.interceptor';

const BASE_URL: string = 'http://localhost:8080/api/';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    SurveyListComponent,
    AnswerComponent,
    UserListComponent,
    CreateSurveyComponent,
    RegisterComponent,
    SingleUserComponent,
    SurveyDetailsComponent,
    InvitationComponent,
    AnswerDetailsComponent,
    AnswerSummaryComponent,
    RatingComponent,
    PieChartComponent,
    BarChartComponent,
    LineChartComponent,
    BasicPageComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    NbIconModule,
    NbEvaIconsModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbActionsModule,
    NbInputModule,
    NbCardModule,
    NbContextMenuModule,
    NbSearchModule,
    NbSelectModule,
    NbToggleModule,
    NbButtonModule,
    NbFormFieldModule,
    NbStepperModule,
    NbListModule,
    NbUserModule,
    NbTabsetModule,
    NbBadgeModule,
    NbPopoverModule,
    NbRadioModule,
    NbTooltipModule,
    NbWindowModule.forRoot(),
    NbCheckboxModule,
    NgbModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    NbAccordionModule,
  ],
  providers: [
    HttpClient,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpTokenInterceptor,
      multi: true
    },
    {
      provide: 'BASE_URL',
      useValue: BASE_URL
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
