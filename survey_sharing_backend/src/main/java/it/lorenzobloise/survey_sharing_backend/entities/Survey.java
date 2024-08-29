package it.lorenzobloise.survey_sharing_backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import it.lorenzobloise.survey_sharing_backend.support.Utils;
import lombok.*;
import org.springframework.cglib.core.Local;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;

@Document("survey")
@ToString
@EqualsAndHashCode
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Survey implements Comparable<Survey> {

    @Id
    private String id;
    @NotBlank(message = "Survey title shall not be blank")
    @Indexed(unique = true)
    private String title;
    private Set<String> questions;
    private String owner; // Username of the owner
    private Set<String> answers; // Answers id
    private Set<String> invitations; // Invitations id
    private boolean closed;
    @JsonIgnore
    private LocalDateTime creationDateObj;
    @JsonIgnore
    private LocalDateTime closingDateObj;
    private String[] creationDate;
    private String[] closingDate;
    @Version
    @JsonIgnore
    private Long version;

    public Survey(String owner, String title){
        this.owner = owner;
        this.title = title;
        this.questions = new TreeSet<>();
        this.closed = false;
        this.creationDateObj = LocalDateTime.now();
        this.creationDate = Utils.parseDate(this.creationDateObj.toString());
        this.closingDateObj = null;
        this.closingDate = null;
        this.answers = new TreeSet<>();
        this.invitations = new TreeSet<>();
    }

    public void close(){
        this.closed = true;
        this.closingDateObj = LocalDateTime.now();
        this.closingDate = Utils.parseDate(closingDateObj.toString());
    }

    public boolean equals(Object o){
        if(o==null) return false;
        if(o==this) return true;
        if(o instanceof Survey){
            Survey s = (Survey)o;
            return this.id.equals(s.getId()) || this.title.equals(s.getTitle());
        }
        return false;
    }

    @Override
    public int compareTo(Survey s) {
        if(this.equals(s)) return 0;
        return this.creationDateObj.compareTo(s.creationDateObj);
    }
}
