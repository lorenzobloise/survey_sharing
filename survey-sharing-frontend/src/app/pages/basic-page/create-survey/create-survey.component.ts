import { Component, OnInit } from '@angular/core';
import { NbMenuService, NbTrigger } from '@nebular/theme';
import { filter, map } from 'rxjs/operators';
import { ImageQuestion, MultipleChoiceQuestion, OpenEndedQuestion, Question } from 'src/app/entities/question';
import { Option } from 'src/app/entities/option';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-create-survey',
  templateUrl: './create-survey.component.html',
  styleUrls: ['./create-survey.component.scss']
})
export class CreateSurveyComponent implements OnInit {

  constructor(private globalService: GlobalService, private nbMenuService: NbMenuService) { }

  surveyTitle: string = '';
  available: boolean | undefined = undefined;
  available2: boolean | undefined = undefined;
  questionTypes = [
    { title: 'Multiple choice' },
    { title: 'Open ended' },
    { title: 'Image' }
  ]
  questions: { id: string, question: Question }[] = [];
  questionPartial: { id: string, question: Question }[] = [];
  currQuestion: number = 0;
  nextIndex: number = 0;
  newOption: string = "";
  questionMaking!: boolean;
  nullVariable: null = null;
  tooltipTrigger: NbTrigger = NbTrigger.HOVER;

  ngOnInit(): void {
    this.globalService.reloadWindow();
    this.nbMenuService.onItemClick()
    .pipe(
      filter(({ tag }) => tag === 'my-context-menu'),
      map(({ item: { title } }) => title)
    )
    .subscribe(title => this.setQuestionPartial(title))
  }

  onInputChange(event: Event): void{
    if(this.surveyTitle==null || this.surveyTitle.trim()==''){
      this.available = undefined;
      return;
    }
    const target = event.target as HTMLInputElement;
    this.surveyTitle = target.value;
    if(this.surveyTitle.trim() != ''){
      this.globalService.surveyService.findSurveyByTitle(this.surveyTitle, true).subscribe(responseMessage => {
        if(responseMessage.object!=null){
          this.available = false;
        }
        else
          this.available = true;
      })
    }
  }

  onInputChange2(event: Event): void{
    if(this.questionPartial[this.currQuestion].question.question==null
      || this.questionPartial[this.currQuestion].question.question.trim()==''){
        this.available2 = undefined;
        return;
    }
    const target = event.target as HTMLInputElement;
    this.questionPartial[this.currQuestion].question.question = target.value;
    if(this.questionPartial[this.currQuestion].question.question.trim()!=''){
      if(this.questions.find(x => x.question.question==this.questionPartial[this.currQuestion].question.question))
        this.available2 = false;
      else
        this.available2 = true;
    }
  }

  getInputStatus(x: boolean | undefined): string{
    switch(x){
      case undefined:
        return "danger";
      case true:
        return "success";
      case false:
        return "danger";
      default:
        return "basic";
    }
  }

  getInputTooltip(x: boolean | undefined): string{
    switch(x){
      case undefined:
        return "Title cannot be blank";
      case true:
        return "Title available";
      case false:
        return "Title already in use";
      default:
        return "basic";
    }
  }

  getInputTooltip2(x: boolean | undefined): string{
    switch(x){
      case undefined:
        return "Question cannot be blank";
      case true:
        return "Question available";
      case false:
        return "Question already defined";
      default:
        return "basic";
    }
  }

  getTooltipIcon(): string{
    switch(this.available){
      case undefined:
        return "close-circle";
      case true:
        return "checkmark-circle-2";
      case false:
        return "close-circle";
      default:
        return "";
    }
  }

  setQuestionPartial(questionType: string){
    let id_generated = this.generateId();
    var q : Question | null;
    switch(questionType){
      case 'Multiple choice':
        q = new MultipleChoiceQuestion();
        break;
      case 'Open ended':
        q = new OpenEndedQuestion();
        break;
      case 'Image':
        q = new ImageQuestion();
        break;
      default:
        q = null;
        break;
    }
    if(q!=null){
      this.questionPartial.push({ id: id_generated, question: q });
      this.questionMaking = true;
    }
  }

  generateId(): string {
    this.nextIndex++;
    return ''+this.nextIndex;
  }

  isMultipleChoice(question: Question): boolean{
    return question instanceof MultipleChoiceQuestion;
  }

  isOpenEnded(question: Question): boolean{
    return question instanceof OpenEndedQuestion;
  }

  isImage(question: Question): boolean{
    return question instanceof ImageQuestion;
  }

  getOptions(question: Question): Option[] | null{
    if(question instanceof MultipleChoiceQuestion){
      return question.options;
    }
    return null;
  }

  addOption(question: Question){
    if(this.newOption==null || this.newOption.trim()=="")
      alert("Option text is empty");
    else if(question instanceof MultipleChoiceQuestion){
      if(question.options.find(x => x.option == this.newOption))
        alert("Option already exists");
      else{
        question.options.push(new Option(this.newOption));
        this.newOption="";
      }
    }
  }

  confirmQuestion(){
    if(this.questionPartial[this.currQuestion].question.question==""){
      alert("Question title cannot be blank");
      return;
    }
    if(this.questionPartial[this.currQuestion].question instanceof MultipleChoiceQuestion
      && (this.getOptions(this.questionPartial[this.currQuestion].question)?.length==0
          || this.getOptions(this.questionPartial[this.currQuestion].question)?.length==1)){
      alert("Questions should have at least two options");
      return;
    }
    this.newOption = "";
    this.questionMaking = false;
    this.questions.push(this.questionPartial[this.currQuestion]);
    this.currQuestion++;
  }

  removeQuestion(question: {id: string, question: Question}){
    const indexToRemove = this.questions.findIndex(x => x.id == question.id);
    if(indexToRemove >= 0)
      this.questions.splice(indexToRemove,1);
  }

  removeOption(option: Option, options: Option[] | null){
    if(options!=null){
      const indexToRemove = options.findIndex(x => x.option == option.option);
      options.splice(indexToRemove,1);
    }
  }

  submit(){
    if(this.surveyTitle.trim()==''){
      alert("Survey title cannot be blank");
      return;
    }
    var questionList: Question[] = [];
    this.questions.forEach(q => questionList.push(q.question));
    if(questionList.length==0){
      alert("Survey must contain at least one question");
      return;
    }
    var jsonObj = JSON.stringify(questionList.map(q => ({
      ...q,
      '@type': q.type
    })))
    console.log(jsonObj);
    this.globalService.surveyService.createSurvey(this.surveyTitle, jsonObj).subscribe(responseMessage => {
      alert(responseMessage.message);
      this.globalService.navigate('home/survey-details', this.surveyTitle);
    })
  }

}
