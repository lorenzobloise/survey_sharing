package it.lorenzobloise.survey_sharing_backend.support;

import it.lorenzobloise.survey_sharing_backend.entities.*;
import lombok.Getter;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

/**
 * Ecosystem for computing statistics
 */
public class StatisticsBuilder {

    private int totalNumberOfUsers;
    private Survey survey;
    private Map<Answer, User> answers;
    private List<Invitation> invitations;
    private Statistics result = new Statistics();

    public StatisticsBuilder(int totalNumberOfUsers, Survey survey, Map<Answer, User> answers, List<Invitation> invitations){
        this.totalNumberOfUsers = totalNumberOfUsers;
        this.survey = survey;
        this.answers = answers;
        this.invitations = invitations;
    }

    public Statistics buildStatistics(){
        buildNumberOfAnswers();
        buildPercentOfUsersWhoAnswered();
        InformationWrapper iw = new InformationWrapper();
        buildAgeStatistics(iw);
        buildGenderStatistics(iw);
        buildCountriesStatistics(iw);
        buildFeedbacksStatistics(iw);
        buildRatingsStatistics(iw);
        buildInvitationsStatistics();
        return this.result;
    }

    /**
     * Useful when the frontend needs to display only the average rating and not the other statistics
     */
    public static double buildAverageRating(Set<Answer> answers){
        double sum = 0;
        int count = 0;
        for(Answer answer: answers)
            if(answer.getRating()!=null && answer.getRating()!=0d) {
                sum += answer.getRating();
                count++;
            }
        return sum/((double)count);
    }

    // Methods for computing statistics

    private void buildNumberOfAnswers(){
        this.result.setNumberOfAnswers(this.answers.size());
    }

    private void buildPercentOfUsersWhoAnswered(){
        if(this.totalNumberOfUsers>0)
            this.result.setPercentOfUsersWhoAnswered(((double)(result.getNumberOfAnswers())/totalNumberOfUsers)*100);
        else
            result.setPercentOfUsersWhoAnswered(0d);
    }

    private void buildAgeStatistics(InformationWrapper iw){
        result.setAgeList(iw.ageList);
        int sum = 0;
        for(int age: iw.ageList) sum+=age;
        result.setAverageAge((double)(sum)/iw.ageList.size());
    }

    private void buildGenderStatistics(InformationWrapper iw){
        result.setNumberOfMaleUsersWhoAnswered(iw.males);
        result.setNumberOfFemaleUsersWhoAnswered(iw.females);
    }

    private void buildCountriesStatistics(InformationWrapper iw){
        result.setCountriesList(iw.countries);
        result.setNumberOfDifferentCountries(iw.differentCountries);
    }

    private void buildFeedbacksStatistics(InformationWrapper iw){
        result.setListOfFeedbacks(iw.feedbacks);
        result.setNumberOfPositiveFeedbacks(iw.positiveFeedbacks);
        result.setNumberOfNegativeFeedbacks(iw.negativeFeedbacks);
        result.setNumberOfMixedFeedbacks(iw.mixedFeedbacks);
        result.setNumberOfNeutralFeedbacks(iw.neutralFeedbacks);
    }

    private void buildRatingsStatistics(InformationWrapper iw){
        result.setRatings(iw.ratings);
        int sum = 0;
        for(double r: iw.ratings) sum+=r;
        result.setAverageRating((double)(sum)/iw.ratings.size());
    }

    private void buildInvitationsStatistics(){
        result.setNumberOfInvitationsSent(this.invitations.size());
        int numAccepted = 0;
        for(Invitation i: this.invitations)
            if(i.isAccepted()) numAccepted++;
        if(this.invitations.isEmpty())
            result.setPercentOfInvitationsAccepted(0);
        else
            result.setPercentOfInvitationsAccepted(((double) (numAccepted) / (this.invitations.size()))*100);
    }

    @Getter
    private class InformationWrapper {

        private List<Integer> ageList = new LinkedList<>();
        private int males = 0;
        private int females = 0;
        private List<String> countries = new LinkedList<>();
        private int differentCountries = 0;
        private List<List<String>> feedbacks = new LinkedList<>();
        private int positiveFeedbacks = 0;
        private int negativeFeedbacks = 0;
        private int mixedFeedbacks = 0;
        private int neutralFeedbacks = 0;
        private List<Double> ratings = new LinkedList<>();

        public InformationWrapper(){
            this.wrapInfo();
        }

        private void wrapInfo(){
            for(Entry<Answer, User> entry: answers.entrySet()){
                Answer answer = entry.getKey();
                User user = entry.getValue();
                // User information
                ageList.add(user.getAge());
                if(user.getGender().equals(User.Gender.Male)) males++;
                else females++;
                String country = user.getCountry();
                if(!countries.contains(country))
                    differentCountries++;
                countries.add(country);
                // Answer information
                String feedback = answer.getFeedback();
                Double rating = answer.getRating();
                if(!feedback.equals(""))
                    sentimentAnalysis(feedback, user, rating);
                if(rating!=null && rating!=0d)
                    this.ratings.add(rating);
            }
        }

        private void sentimentAnalysis(String feedback, User user, Double rating){
            SentimentAnalysis sa = new SentimentAnalysis();
            String sentiment = sa.detectSentimentWithComprehend(feedback);
            List<String> entry = new LinkedList<>();
            entry.add(feedback);
            entry.add(sentiment);
            entry.add(user.getFirstname());
            entry.add(user.getLastname());
            entry.add(user.getUsername());
            entry.add(rating.toString());
            feedbacks.add(entry);
            switch (sentiment) {
                case "POSITIVE" -> this.positiveFeedbacks++;
                case "NEGATIVE" -> this.negativeFeedbacks++;
                case "MIXED" -> this.mixedFeedbacks++;
                case "NEUTRAL" -> this.neutralFeedbacks++;
                default -> {}
            }
        }

    }

}
