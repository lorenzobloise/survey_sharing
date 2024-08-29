export class RegistrationRequest {
  username!:string;
  firstname!:string;
  lastname!:string;
  email!:string;
  password!:string;
  age!:number;
  gender!:string;
  country!:string;

  constructor(username: string, firstname: string, lastname: string, email: string, password: string,
              age: number, gender: string, country: string){
    this.username = username;
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.password = password;
    this.age = age;
    this.gender = gender;
    this.country = country;
  }
}
