package it.lorenzobloise.survey_sharing_backend.entities;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.util.LinkedList;
import java.util.List;

@Document("question")
@ToString
@Getter
@Setter
@NoArgsConstructor
public class MultipleChoiceQuestion extends Question {

    @DocumentReference
    private List<Option> options = new LinkedList<>();

    public MultipleChoiceQuestion(MultipleChoiceQuestion mcq){
        super(mcq);
        this.type = QuestionType.MultipleChoiceQuestion.toString();
    }

}
