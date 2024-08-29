package it.lorenzobloise.survey_sharing_backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import it.lorenzobloise.survey_sharing_backend.support.Utils;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "@type"
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = ImageQuestion.class, name = "ImageQuestion"),
        @JsonSubTypes.Type(value = MultipleChoiceQuestion.class, name = "MultipleChoiceQuestion"),
        @JsonSubTypes.Type(value = OpenEndedQuestion.class, name = "OpenEndedQuestion")
})
@Document("question")
@ToString
@EqualsAndHashCode
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Question {

    public enum QuestionType{MultipleChoiceQuestion, OpenEndedQuestion, ImageQuestion}
    @Id
    private String id;
    @NotBlank(message = "Question shall not be blank")
    private String question;
    protected String type;
    @JsonIgnore
    protected LocalDateTime questionDateObj;
    protected String[] questionDate;
    @Version
    private Long version;

    public Question(Question question){
        this();
        this.question = question.getQuestion();
        this.type = "";
        this.questionDate = question.getQuestionDate();
        this.questionDateObj = LocalDateTime.of(Integer.parseInt(this.questionDate[2]), Integer.parseInt(this.questionDate[1]),
                                                Integer.parseInt(this.questionDate[0]), Integer.parseInt(this.questionDate[3]),
                                                Integer.parseInt(this.questionDate[4]), Integer.parseInt(this.questionDate[5]));
    }

}