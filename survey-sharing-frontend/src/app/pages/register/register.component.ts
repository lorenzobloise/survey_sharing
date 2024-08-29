import { Component, inject, OnInit } from '@angular/core';
import { NbTrigger } from '@nebular/theme';
import { RegistrationRequest } from 'src/app/entities/auth/registration-request';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { RegistrationService } from 'src/app/services/auth/registration.service';
import { GlobalService } from 'src/app/services/global.service';
import { countries } from 'src/app/support/countries';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  showPassword = false;
  fields: {email: {email: string, correct: boolean | undefined, error: string},
            username: {username: string, correct: boolean | undefined, error: string},
            password: {password: string, correct: boolean | undefined, error: string},
            firstname: {firstname: string, correct: boolean | undefined, error: string},
            lastname: {lastname: string, correct: boolean | undefined, error: string},
            age: {age: number | undefined, correct: boolean | undefined, error: string},
            gender: {gender: string, correct: boolean | undefined, error: string},
            country: {country: string, correct: boolean | undefined, error: string}}
            =
            {email: {email: "", correct: undefined, error: ""},
            username: {username: "", correct: undefined, error: ""},
            password: {password: "", correct: undefined, error: ""},
            firstname: {firstname: "", correct: undefined, error: ""},
            lastname: {lastname: "", correct: undefined, error: ""},
            age: {age: undefined, correct: undefined, error: ""},
            gender: {gender: "", correct: undefined, error: ""},
            country: {country: "", correct: undefined, error: ""}};
  tooltipTrigger: NbTrigger = NbTrigger.HOVER;
  countries = countries;

  constructor(public globalService: GlobalService, private authenticationService: AuthenticationService,
              private registrationService: RegistrationService) { }

  ngOnInit(): void {
    this.globalService.reloadWindow();
  }

  getInputType() {
    if (this.showPassword) {
      return 'text';
    }
    return 'password';
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  register(){
    const registrationRequest: RegistrationRequest = new RegistrationRequest(
      this.fields.username.username, this.fields.firstname.firstname, this.fields.lastname.lastname, this.fields.email.email,
      this.fields.password.password, this.fields.age.age as number, this.fields.gender.gender, this.fields.country.country);
    this.authenticationService.register(registrationRequest).subscribe(responseMessage => {
      if(responseMessage.object!=null){
        alert(responseMessage.message);
        this.globalService.navigate('login',null);
      }
      else
        alert(responseMessage.message);
    })
  }

  onInputChangeEmail(event: Event): void{
    this.registrationService.emailCheck(this.fields.email);
  }

  onInputChangeUsername(event: Event): void{
    this.registrationService.usernameCheck(this.fields.username);
  }

  onInputChangePassword(event: Event): void{
    this.registrationService.passwordCheck(this.fields.password);
  }

  onInputChangeFirstname(event: Event): void{
    this.registrationService.firstnameCheck(this.fields.firstname);
  }

  onInputChangeLastname(event: Event): void{
    this.registrationService.lastnameCheck(this.fields.lastname);
  }

  onInputChangeAge(event: Event): void{
    this.registrationService.ageCheck(this.fields.age);
  }

  onInputChangeGender(event: Event): void{
    this.registrationService.genderCheck(this.fields.gender);
  }

  onInputChangeCountry(event: Event): void{
    this.registrationService.countryCheck(this.fields.country);
  }

  getStatus(correct: boolean | undefined): string {
    switch(correct){
      case undefined:
        return "basic";
      case true:
        return "success";
      case false:
        return "danger";
      default:
        return "basic";
    }
  }

  getTooltipIcon(correct: boolean | undefined): string {
    switch(correct){
      case undefined:
        return "";
      case true:
        return "checkmark-circle-2";
      case false:
        return "close-circle";
      default:
        return "";
    }
  }

}
