import { Survey } from "./survey";

export class Statistics{
  id!: string;
  survey!: string;
  numberOfAnswers!: number;
  percentOfUsersWhoAnswered!: number;
  averageAge!: number;
  ageList!: number[];
  numberOfMaleUsersWhoAnswered!: number;
  numberOfFemaleUsersWhoAnswered!: number;
  countriesList!: string[];
  numberOfDifferentCountries!: number;
  numberOfInvitationsSent!: number;
  percentOfInvitationsAccepted!: number;
  listOfFeedbacks!: string[][];
  numberOfPositiveFeedbacks!: number;
  numberOfNegativeFeedbacks!: number;
  numberOfMixedFeedbacks!: number;
  numberOfNeutralFeedbacks!: number;
  ratings!: number[];
  averageRating!: number;

  constructor(id: string, survey: string, numberOfAnswers: number, percentOfUsersWhoAnswered: number, averageAge: number, ageList: number[],
              numberOfMaleUsersWhoAnswered: number, numberOfFemaleUsersWhoAnswered: number, countriesList: string[],
              numberOfDifferentCountries: number, numberOfInvitationsSent: number, percentOfInvitationsAccepted: number,
              listOfFeedbacks: string[][], numberOfPositiveFeedbacks: number, numberOfNegativeFeedbacks: number, numberOfMixedFeedbacks: number,
              numberOfNeutralFeedbacks: number, ratings: number[], averageRating: number) {
    this.id = id;
    this.survey = survey;
    this.numberOfAnswers = numberOfAnswers;
    this.percentOfUsersWhoAnswered = percentOfUsersWhoAnswered;
    this.averageAge = averageAge;
    this.ageList = ageList;
    this.numberOfMaleUsersWhoAnswered = numberOfMaleUsersWhoAnswered;
    this.numberOfFemaleUsersWhoAnswered = numberOfFemaleUsersWhoAnswered;
    this.countriesList = countriesList;
    this.numberOfDifferentCountries = numberOfDifferentCountries;
    this.numberOfInvitationsSent = numberOfInvitationsSent;
    this.percentOfInvitationsAccepted = percentOfInvitationsAccepted;
    this.listOfFeedbacks = listOfFeedbacks;
    this.numberOfPositiveFeedbacks = numberOfPositiveFeedbacks;
    this.numberOfNegativeFeedbacks = numberOfNegativeFeedbacks;
    this.numberOfMixedFeedbacks = numberOfMixedFeedbacks;
    this.numberOfNeutralFeedbacks = numberOfNeutralFeedbacks;
    this.ratings = ratings;
    this.averageRating = averageRating;
  }
}
