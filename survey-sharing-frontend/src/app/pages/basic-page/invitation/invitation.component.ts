import { Component, Input, OnInit } from '@angular/core';
import { Invitation } from 'src/app/entities/invitation';
import { User } from 'src/app/entities/user';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.scss']
})
export class InvitationComponent implements OnInit {

  surveyTitle!: string;
  user!: string;
  users: {invited: boolean, user: User}[] = []
  message: string = "";

  constructor(private globalService: GlobalService) {
    this.surveyTitle = localStorage.getItem('surveyTitle') as string;
    this.user = this.globalService.getUser().username;
    console.log(this.user);
    console.log(this.surveyTitle);
  }

  ngOnInit(): void {
    this.globalService.userService.findAllUsers().subscribe(responseMessage => {
      if(responseMessage.object!=null){
        const result: User[] = responseMessage.object;
        result.forEach(x => {
          if(x.username != this.user)
            this.users.push({ invited: false, user: x });
        })
      }
    })
  }

  sendInvitations(){
    var toSend: Invitation[] = [];
    this.users.forEach(x => {
      if(x.invited){
        var i = new Invitation(x.user.username, this.surveyTitle, this.message);
        toSend.push(i);
      }
    })
    this.globalService.invitationService.createInvitations(this.surveyTitle, toSend).subscribe(responseMessage => {
      alert(responseMessage.message);
      window.location.reload();
    })
  }

}
