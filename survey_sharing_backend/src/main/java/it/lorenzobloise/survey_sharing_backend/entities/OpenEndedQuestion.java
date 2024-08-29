package it.lorenzobloise.survey_sharing_backend.entities;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("question")
@ToString
@Getter
@Setter
@NoArgsConstructor
public class OpenEndedQuestion extends Question {

    private String answer;

    public OpenEndedQuestion(OpenEndedQuestion oeq){
        super(oeq);
        this.answer = oeq.getAnswer();
        this.type = QuestionType.OpenEndedQuestion.toString();
    }

}