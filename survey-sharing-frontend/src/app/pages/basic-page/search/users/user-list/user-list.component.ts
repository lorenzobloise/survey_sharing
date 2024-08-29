import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/entities/user';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  private query!: string | null;
  public search_results: User[] = [];

  constructor(public globalService: GlobalService) { }

  ngOnInit(): void {
    this.globalService.reloadWindow();
    this.query = localStorage.getItem('query');
    this.search_results = [];
    if(this.query==null || this.query===""){
      this.globalService.userService.findAllUsers().subscribe(responseMessage => {
        this.search_results = responseMessage.object;
        if(this.search_results.length==0) alert (responseMessage.message);
        else{
          const indexToRemove: number = this.search_results.findIndex(x => x.username==this.globalService.getUser().username);
          this.search_results.splice(indexToRemove, 1);
        }
      })
    }
    else{
      this.globalService.userService.findUsersByFirstnameAndLastname(this.query).subscribe(responseMessage => {
        (responseMessage.object as User[]).forEach(u => {
          if(!this.search_results.find(x => x.username==u.username))
            this.search_results.push(u);
        })
      });
      this.globalService.userService.findUsersByUsername(this.query).subscribe(responseMessage => {
        (responseMessage.object as User[]).forEach(u => {
          if(!this.search_results.find(x => x.username==u.username))
            this.search_results.push(u);
        })
      });
    }
  }

  goToSingleUserPage(username: string): void{
    this.globalService.navigate('home/search/users/single-user', username);
  }

}
