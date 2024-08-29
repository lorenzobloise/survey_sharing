import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent {

  @Input() averageRating!: number;
  totalStars: number = 5;
  stars: number[] = [1,2,3,4,5];

  getStarWidth(star: number): string {
    if (this.averageRating >= star) {
      return '100%';
    } else if (this.averageRating + 1 > star) {
      const fractionalPart = (this.averageRating + 1 - star) * 100;
      return `${fractionalPart}%`;
    } else {
      return '0%';
    }
  }

}
