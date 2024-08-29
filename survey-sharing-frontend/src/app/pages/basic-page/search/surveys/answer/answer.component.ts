import { Component, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Answer } from 'src/app/entities/answer';
import { Image } from 'src/app/entities/image';
import { Option } from 'src/app/entities/option';
import { ImageQuestion, MultipleChoiceQuestion, OpenEndedQuestion, Question } from 'src/app/entities/question';
import { Survey } from 'src/app/entities/survey';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.scss']
})
export class AnswerComponent implements OnInit {

  answer!: Answer;
  survey!: Survey;
  questions: {id: number, question: Question, answer: string}[] = [];
  images: {id: string, image: Image, src: SafeUrl}[] = [];
  questionId: number = 0;
  rating: number = 0;
  feedback: string = "";
  nextIndex: number = 0;

  constructor(private globalService: GlobalService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.globalService.reloadWindow();
    var surveyTitle = this.route.snapshot.paramMap.get('surveyTitle');
    if(surveyTitle!=null){
      this.globalService.surveyService.findSurveyByTitle(surveyTitle, false).subscribe(responseMessage => {
        if(responseMessage.object!=null){
          this.survey = responseMessage.object;
          this.answer = new Answer(this.globalService.getUser().username, this.survey.title);
          this.survey.questions.forEach(q => {
            this.globalService.questionService.findQuestionById(q).subscribe(responseMessage2 => {
              if(responseMessage2.object!=null){
                if(this.isMultipleChoice(responseMessage2.object)){
                  var newQ: MultipleChoiceQuestion = new MultipleChoiceQuestion();
                  newQ.setOptions((responseMessage2.object as MultipleChoiceQuestion).options);
                  newQ.setQuestion(responseMessage2.object.question);
                  newQ.setQuestionDate(responseMessage2.object.questionDate);
                  this.questions.push({id: this.generateId(), question: newQ, answer: ""});
                }
                if(this.isOpenEnded(responseMessage2.object)){
                  var newQ2: OpenEndedQuestion = new OpenEndedQuestion();
                  newQ2.setAnswer((responseMessage2.object as OpenEndedQuestion).answer);
                  newQ2.setQuestion(responseMessage2.object.question);
                  newQ2.setQuestionDate(responseMessage2.object.questionDate);
                  this.questions.push({id: this.generateId(), question: newQ2, answer: ""});
                }
                if(this.isImage(responseMessage2.object)){
                  var newQ3: ImageQuestion = new ImageQuestion();
                  newQ3.setImage((responseMessage2.object as ImageQuestion).image);
                  newQ3.setQuestion(responseMessage2.object.question);
                  newQ3.setQuestionDate(responseMessage2.object.questionDate);
                  this.questions.push({id: this.generateId(), question: newQ3, answer: ""});
                }
                this.questions.sort((q1, q2) => this.globalService.compareDates(q1.question.questionDate, q2.question.questionDate));
              }
            })
          })
        }
        else alert(responseMessage.message);
      })
    }
  }

  generateId(): number {
    this.questionId++;
    return this.questionId;
  }

  getSurvey(): Survey{
    if(this.survey!=null) return this.survey;
    return new Survey("","","",false,[],[],[],[],[]);
  }

  isMultipleChoice(question: Question): boolean {
    return question.type=='MultipleChoiceQuestion';
  }

  isOpenEnded(question: Question): boolean {
    return question.type=='OpenEndedQuestion';
  }

  isImage(question: Question): boolean {
    return question.type=='ImageQuestion';
  }

  getOptions(question: Question): Option[] | null {
    if(question.type=='MultipleChoiceQuestion'){
      const mcq: MultipleChoiceQuestion = question as MultipleChoiceQuestion;
      return mcq.options;
    }
    return null;
  }

  existsEmptyAnswer(): boolean {
    return this.questions.find(q => q.answer=="")!=undefined;
  }

  uploadImage(image: HTMLInputElement, questionId: number): void {
    if(image.files!=null && image.files.length>0){
      const file: File = image.files[0];
      const fileToByteArray = async(): Promise<number[]> => {
        return new Promise((resolve, reject) => {
          try{
            let reader = new FileReader();
            let fileByteArray: number[] = [];
            reader.readAsArrayBuffer(file);
            reader.onloadend = (evt) => {
              if(evt.target?.readyState === FileReader.DONE){
                const arrayBuffer = evt.target.result;
                if(arrayBuffer!=null && typeof arrayBuffer!=='string'){
                  const array = new Uint8Array(arrayBuffer);
                  array.forEach((item) => fileByteArray.push(item));
                }
              }
              resolve(fileByteArray);
            };
            reader.onerror = (error) => {
              reject(error);
            };
          }catch(e){
            reject(e);
          }
        })
      };
      (async() => {
        try{
          const byteArray = await fileToByteArray();
          this.globalService.imageService.uploadImage(byteArray, file.name).subscribe(responseMessage => {
            if(responseMessage.object!=null){
              const image: Image = responseMessage.object;
              var index: number = this.questions.findIndex(q => q.id==questionId);
              if(index!=-1){
                this.questions[index].answer = image.id;
                const mimeType = this.globalService.getImageMimeType(image.fileName);
                const blob = new Blob([new Uint8Array(byteArray)], { type: mimeType });
                const imageUrl = URL.createObjectURL(blob);
                const sanitizedImageUrl = this.globalService.sanitizer.bypassSecurityTrustUrl(imageUrl);
                this.images.push({id: image.id, image: image, src: sanitizedImageUrl});
                alert("Image uploaded");
              }
            }
          })
        }catch(e){
          alert("There was an error uploading the image");
          console.error(e);
        }
      })();
    }
  }

  getImage(imageId: string): {id: string, image: Image, src: SafeUrl} | null {
    const index: number = this.images.findIndex(i=> i.id==imageId);
    if(index!=-1)
      return this.images[index];
    return null;
  }

  submit(): void {
    if(this.existsEmptyAnswer()){
      alert("All questions must have been answered");
      return;
    }
    this.questions.forEach(q => {
      if(this.isMultipleChoice(q.question)){
        var q2: MultipleChoiceQuestion = q.question as MultipleChoiceQuestion;
        const indexOptionSelected: number = q2.options.findIndex(x => x.option==q.answer)
        q2.options[indexOptionSelected].selected = true;
      }
      if(this.isOpenEnded(q.question))
        (q.question as OpenEndedQuestion).setAnswer(q.answer);
      if(this.isImage(q.question))
        (q.question as ImageQuestion).setImage(q.answer);
    })
    var questionList: Question[] = [];
    this.questions.forEach(q => {
      questionList.push(q.question);
    })
    var jsonObj = JSON.stringify(questionList.map(q => ({
      ...q,
      '@type': q.type
    })))
    this.globalService.answerService.createAnswer(this.getSurvey().title, this.rating, this.feedback, jsonObj).subscribe(responseMessage => {
      alert(responseMessage.message);
      this.globalService.navigate('home/answer-details', this.getSurvey().title);
    })
  }

}
