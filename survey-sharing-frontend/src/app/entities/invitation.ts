import { Survey } from "./survey";
import { User } from "./user";

export class Invitation{
  id!: string;
  user!: string;
  survey!: string;
  message!: string;
  accepted!: boolean;
  invitationDate!: string[];

  constructor(user: string, survey: string, message: string){
    this.user = user;
    this.survey = survey;
    this.message = message;
    this.accepted = false;
    const now: Date = new Date();
    this.invitationDate = [now.getDate()+'', (now.getMonth()+1)+'', now.getFullYear()+'',
      now.getHours()+'',now.getMinutes()+'',(now.getSeconds()+'').padStart(2, '0')];
  }
}
