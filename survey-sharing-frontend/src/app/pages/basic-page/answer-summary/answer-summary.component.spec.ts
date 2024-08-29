import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerSummaryComponent } from './answer-summary.component';

describe('AnswerSummaryComponent', () => {
  let component: AnswerSummaryComponent;
  let fixture: ComponentFixture<AnswerSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnswerSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnswerSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
