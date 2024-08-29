export class User{
  id!: string;
  username!: string;
  firstname!: string;
  lastname!: string;
  email!: string;
  age!: number;
  gender!: string;
  country!: string;
  createdSurveys!: string[];
  answers!: Map<string,string>
  invitations!: string[];
  registrationDate!: string[];

  constructor(id: string, username: string, firstname: string, lastname: string, email: string,
              age: number, gender: string, country: string, registrationDate: string[]){
    this.id = id;
    this.username = username;
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.age = age;
    this.gender = gender;
    this.country = country;
    this.registrationDate = registrationDate;
  }

  setCreatedSurveys(createdSurveys: string[]){
    this.createdSurveys = createdSurveys;
  }

  setAnswers(answers: Map<string,string>){
    this.answers = answers;
  }

  setInvitations(invitations: string[]){
    this.invitations = invitations;
  }
}
