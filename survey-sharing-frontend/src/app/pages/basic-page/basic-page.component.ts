import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-basic-page',
  templateUrl: './basic-page.component.html',
  styleUrls: ['./basic-page.component.scss']
})
export class BasicPageComponent implements OnInit {

  query: string = "";
  searchType: string = "";
  darkMode: boolean = this.globalService.getDarkMode() as boolean;

  constructor(public globalService: GlobalService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.globalService.initialize();
  }

  onInputChange(event: Event){
    this.globalService.setQuery(this.query);
  }

  onModelChange(event: Event){
    this.globalService.setSearchType(this.searchType);
  }

  onCheckedChange(event: boolean){
    this.globalService.setDarkMode(this.darkMode);
    this.globalService.switchTheme();
  }

  search(){
    localStorage.setItem('query', this.query);
    this.globalService.navigate('home/search/'+this.globalService.getSearchType(), null);
  }

}
