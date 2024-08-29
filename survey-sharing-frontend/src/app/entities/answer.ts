import { Question } from "./question";
import { Survey } from "./survey";
import { User } from "./user";

export class Answer{
  id!: string;
  user!: string;
  survey!: string;
  questions!: string[];
  answerDate!: string[];
  feedback!: string;
  rating!: number | null;

  constructor(user: string, survey: string){
    this.user = user;
    this.survey = survey;
    this.questions = [];
    const now: Date = new Date();
    this.answerDate = [now.getDate()+'', (now.getMonth()+1)+'', now.getFullYear()+'',
      now.getHours()+'',now.getMinutes()+'',(now.getSeconds()+'').padStart(2, '0')];
  }
}
