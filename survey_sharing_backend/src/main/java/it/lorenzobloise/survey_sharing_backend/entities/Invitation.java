package it.lorenzobloise.survey_sharing_backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import it.lorenzobloise.survey_sharing_backend.support.Utils;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Document("invitation")
@ToString
@EqualsAndHashCode
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Invitation implements Comparable<Invitation> {

    @Id
    private String id;
    @NotBlank(message = "User shall not be blank")
    private String user;
    @NotBlank(message = "Survey shall not be blank")
    private String survey;
    private String message;
    private boolean accepted;
    @JsonIgnore
    private LocalDateTime invitationDateObj;
    private String[] invitationDate;

    public Invitation(String user, String survey, String message){
        this.user = user;
        this.survey = survey;
        this.message = message;
        this.invitationDateObj = LocalDateTime.now();
        this.invitationDate = Utils.parseDate(this.invitationDateObj.toString());
    }

    public Invitation(Invitation i){
        this(i.getUser(), i.getSurvey(), i.getMessage());
        this.invitationDate = i.getInvitationDate();
        this.invitationDateObj = LocalDateTime.of(Integer.parseInt(this.invitationDate[2]), Integer.parseInt(this.invitationDate[1]),
                                                    Integer.parseInt(this.invitationDate[0]), Integer.parseInt(this.invitationDate[3]),
                                                    Integer.parseInt(this.invitationDate[4]), Integer.parseInt(this.invitationDate[5]));
    }

    public boolean equals(Object o){
        if(o==null) return false;
        if(o==this) return true;
        if(o instanceof Invitation){
            Invitation i = (Invitation) o;
            return user.equals(i.getUser()) && survey.equals(i.getSurvey()) && invitationDateObj.equals(i.getInvitationDateObj());
        }
        return false;
    }

    public int compareTo(Invitation i){
        if(this.equals(i)) return 0;
        return this.invitationDateObj.compareTo(i.getInvitationDateObj());
    }

}