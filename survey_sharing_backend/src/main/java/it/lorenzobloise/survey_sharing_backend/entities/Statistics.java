package it.lorenzobloise.survey_sharing_backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document("statistics")
@ToString
@EqualsAndHashCode
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Statistics {

    @Id
    private String id;
    @Indexed(unique = true)
    @JsonIgnore
    private String survey;
    private int numberOfAnswers;
    private double percentOfUsersWhoAnswered;
    private double averageAge;
    private List<Integer> ageList;
    private int numberOfMaleUsersWhoAnswered;
    private int numberOfFemaleUsersWhoAnswered;
    private List<String> countriesList;
    private int numberOfDifferentCountries;
    private int numberOfInvitationsSent;
    private double percentOfInvitationsAccepted;
    private List<List<String>> listOfFeedbacks;
    private int numberOfPositiveFeedbacks;
    private int numberOfNegativeFeedbacks;
    private int numberOfMixedFeedbacks;
    private int numberOfNeutralFeedbacks;
    private List<Double> ratings;
    private double averageRating;
    @JsonIgnore
    @Version
    private Long version;

}
