import { Component, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Answer } from 'src/app/entities/answer';
import { Image } from 'src/app/entities/image';
import { Option } from 'src/app/entities/option';
import { ImageQuestion, MultipleChoiceQuestion, OpenEndedQuestion, Question } from 'src/app/entities/question';
import { Survey } from 'src/app/entities/survey';
import { User } from 'src/app/entities/user';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-answer-summary',
  templateUrl: './answer-summary.component.html',
  styleUrls: ['./answer-summary.component.scss']
})
export class AnswerSummaryComponent implements OnInit {

  answer!: Answer;
  survey!: Survey;
  user!: User;
  questions: {question: Question, answer: string}[] = [];
  images: {id: string, image: Image, src: SafeUrl}[] = [];

  constructor(private globalService: GlobalService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.globalService.reloadWindow();
    var answer_id = this.route.snapshot.paramMap.get('answer_id');
    if(answer_id!=null){
      this.globalService.answerService.findAnswerById(answer_id).subscribe(responseMessage => {
        if(responseMessage.object!=null){
          this.answer = responseMessage.object;
          this.globalService.surveyService.findSurveyByTitle(this.answer.survey, true).subscribe(responseMessage2 => {
            if(responseMessage2.object!=null){
              this.survey = responseMessage2.object;
            }
          })
          this.globalService.userService.findUserByUsername(this.answer.user).subscribe(responseMessage2 => {
            if(responseMessage2.object!=null)
              this.user = responseMessage2.object;
          })
          this.answer.questions.forEach(q => {
            this.globalService.questionService.findQuestionById(q).subscribe(responseMessage2 => {
              if(responseMessage2.object!=null){
                const currQuestion: Question = responseMessage2.object;
                var answer: string = "";
                if(this.isMultipleChoice(currQuestion)){
                  const mcq: MultipleChoiceQuestion = currQuestion as MultipleChoiceQuestion;
                  const checked: Option | undefined = mcq.options.find(o => o.selected==true);
                  if(checked!=undefined)
                    answer = checked.option;
                }
                if(this.isOpenEnded(currQuestion)){
                  const oeq: OpenEndedQuestion = currQuestion as OpenEndedQuestion;
                  answer = oeq.answer;
                }
                if(this.isImage(currQuestion)){
                  const iq: ImageQuestion = currQuestion as ImageQuestion;
                  answer = iq.image;
                  this.globalService.imageService.findImageById(iq.image).subscribe(responseMessage3 => {
                    if(responseMessage3.object!=null){
                      const image: Image = responseMessage3.object;
                      const mimeType = this.globalService.getImageMimeType(image.fileName);
                      const blob = new Blob([new Uint8Array(image.image)], { type: mimeType });
                      const imageUrl = URL.createObjectURL(blob);
                      const sanitizedImageUrl = this.globalService.sanitizer.bypassSecurityTrustUrl(imageUrl);
                      this.images.push({id: image.id, image: image, src: sanitizedImageUrl});
                    }
                  })
                }
                this.questions.push({question: currQuestion, answer: answer});
                this.questions.sort((q1, q2) => this.globalService.compareDates(q1.question.questionDate, q2.question.questionDate));
              }
            })
          })
        }
      })
    }
  }

  getAnswer(): Answer {
    if(this.answer)
      return this.answer;
    return new Answer("","");
  }

  getImage(question: Question): {id: string, image: Image, src: SafeUrl} | null {
    if(this.isImage(question)){
      const iq: ImageQuestion = question as ImageQuestion;
      const index: number = this.images.findIndex(i => i.id==iq.image);
      if(index!=-1){
        return this.images[index];
      }
    }
    return null;
  }

  getSurvey(): Survey {
    if(this.survey)
      return this.survey;
    return new Survey("","","",false,[],[],[],[],[]);
  }

  getUser(): User {
    if(this.user)
      return this.user;
    return new User("","","","","",-1,"","",[]);
  }

  isMultipleChoice(q: Question){
    return q.type=='MultipleChoiceQuestion';
  }

  isOpenEnded(q: Question){
    return q.type=='OpenEndedQuestion';
  }

  isImage(q: Question){
    return q.type=='ImageQuestion';
  }

  getOptions(q: Question): Option[] | null{
    if(q.type=='MultipleChoiceQuestion'){
      const mcq: MultipleChoiceQuestion = q as MultipleChoiceQuestion;
      return mcq.options;
    }
    return null;
  }

  getRating(): number {
    if(this.getAnswer().rating)
      return this.getAnswer().rating as number;
    return 0;
  }
}
