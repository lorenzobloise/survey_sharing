import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { AuthenticationRequest } from 'src/app/entities/auth/authentication-request';
import { AuthenticationResponse } from 'src/app/entities/auth/authentication-response';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { GlobalService } from 'src/app/services/global.service';
import { TokenService } from 'src/app/services/auth/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username!: string;
  password!: string;
  showPassword = false;

  constructor(private globalService: GlobalService, private authenticationService: AuthenticationService,
              private tokenService: TokenService, private router: Router) { }

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

  login(){
    const authRequest: AuthenticationRequest = new AuthenticationRequest(this.username, this.password);
    this.authenticationService.authenticate(authRequest).subscribe(responseMessage => {
      if(responseMessage.object!=null){
        const authResponse: AuthenticationResponse = responseMessage.object;
        localStorage.setItem('username', this.username);
        this.tokenService.token = authResponse.token as string;
        localStorage.setItem('loggedIn', 'true');
        this.globalService.navigate('home/user',null);
      }
      else
        alert(responseMessage.message);
    })
  }

  navigateToRegister(){
    this.globalService.navigate('/register',null);
  }

}
