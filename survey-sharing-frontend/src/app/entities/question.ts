import { Option } from "./option";

export class Question{
  question!: string;
  type!: string;
  questionDate!: string[];

  constructor(){
    this.question = "";
    this.type = "";
    const now: Date = new Date();
    this.questionDate = [now.getDate()+'', (now.getMonth()+1)+'', now.getFullYear()+'',
                        now.getHours()+'',now.getMinutes()+'',(now.getSeconds()+'').padStart(2, '0')];
  }

  setQuestion(question: string){
    this.question = question;
  }

  setType(type: string){
    this.type = type;
  }

  setQuestionDate(questionDate: string[]){
    this.questionDate = questionDate;
  }
}

export class MultipleChoiceQuestion extends Question{
  options!: Option[];

  constructor(){
    super();
    this.options = [];
    this.type = "MultipleChoiceQuestion";
  }

  setOptions(options: Option[]){
    options.forEach(o => {
      if(!this.options.find(x => x.id==o.id))
        this.options.push(new Option(o.option));
    })
  }
}

export class OpenEndedQuestion extends Question{
  answer!: string;

  constructor(){
    super();
    this.type = "OpenEndedQuestion";
  }

  setAnswer(answer: string){
    this.answer = answer;
  }
}

export class ImageQuestion extends Question{
  image!: string;

  constructor(){
    super();
    this.type = "ImageQuestion";
  }

  setImage(image: string){
    this.image = image;
  }
}
