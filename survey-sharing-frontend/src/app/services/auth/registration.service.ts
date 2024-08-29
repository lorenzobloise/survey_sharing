import { Injectable } from "@angular/core";
import { GlobalService } from "../global.service";

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  private emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private passwordPattern = /^(?=.*\d).{8,}$/;
  private firstnamePattern = /^[A-Za-z]+$/;
  private lastnamePattern = /^[A-Za-z]+$/;
  private agePattern = /^[0-9]+$/;

  constructor(private globalService: GlobalService){ }

  public emailCheck(email: { email: string, correct: boolean | undefined, error: string }): void {
    if(email.email.trim()==""){
      email.correct = false;
      email.error = "Email cannot be blank";
      return;
    }
    if(!this.emailPattern.test(email.email)){
      email.correct = false;
      email.error = "Invalid email format";
      return;
    }
    this.globalService.userService.findUserByEmail(email.email).subscribe(responseMessage => {
      if(responseMessage.object!=null){
        email.correct = false;
        email.error = "Email already in use";
        return;
      }
      email.correct = true;
      email.error = "";
    })
  }

  public usernameCheck(username: { username: string, correct: boolean | undefined, error: string }): void {
    if(username.username==""){
      username.correct = false;
      username.error = "Username cannot be blank";
      return;
    }
    if (username.username.length < 3 || username.username.length > 15) {
      username.correct = false;
      username.error = "Username must be between 3 and 15 characters";
      return;
    }
    this.globalService.userService.findUserByUsername(username.username).subscribe(responseMessage => {
      if(responseMessage.object!=null){
        username.correct = false;
        username.error = "Username already in use";
        return;
      }
      username.correct = true;
      username.error = "";
    })
  }

  public passwordCheck(password: { password: string, correct: boolean | undefined, error: string }): void {
    if (!this.passwordPattern.test(password.password)) {
      password.correct = false;
      password.error = "Password must be at least 8 characters long and contain at least one number";
      return;
    }
    password.correct = true;
    password.error = "";
  }

  public firstnameCheck(firstname: { firstname: string, correct: boolean | undefined, error: string }): void {
    if(firstname.firstname==""){
      firstname.correct = false;
      firstname.error = "Name cannot be blank";
      return;
    }
    if(!this.firstnamePattern.test(firstname.firstname)){
      firstname.correct = false;
      firstname.error = "Invalid name format";
      return;
    }
    firstname.correct = true;
    firstname.error = "";
  }

  public lastnameCheck(lastname: { lastname: string, correct: boolean | undefined, error: string }): void {
    if(lastname.lastname==""){
      lastname.correct = false;
      lastname.error = "Surname cannot be blank";
      return;
    }
    if(!this.lastnamePattern.test(lastname.lastname)){
      lastname.correct = false;
      lastname.error = "Invalid surname format";
      return;
    }
    lastname.correct = true;
    lastname.error = "";
  }

  public ageCheck(age: { age: number | undefined, correct: boolean | undefined, error: string }): void {
    if(age.age==undefined){
      age.correct = false;
      age.error = "Age cannot be blank";
      return;
    }
    if(!this.agePattern.test(age.age+'')){
      age.correct = false;
      age.error = "Invalid age format";
      return;
    }
    age.correct = true;
    age.error = "";
  }

  public genderCheck(gender: {gender: string, correct: boolean | undefined, error: string}): void {
    if(gender.gender==""){
      gender.correct = false;
      gender.error = "Gender cannot be blank";
      return;
    }
    gender.correct = true;
    gender.error = "";
  }

  public countryCheck(country: {country: string, correct: boolean | undefined, error: string}): void {
    if(country.country==""){
      country.correct = false;
      country.error = "Country cannot be blank";
      return;
    }
    country.correct = true;
    country.error = "";
  }

}
