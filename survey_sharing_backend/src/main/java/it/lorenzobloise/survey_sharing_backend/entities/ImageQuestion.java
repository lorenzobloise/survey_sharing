package it.lorenzobloise.survey_sharing_backend.entities;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotBlank;

@Document("question")
@ToString
@Getter
@Setter
@NoArgsConstructor
public class ImageQuestion extends Question {

    @NotBlank(message = "Id of the image shall not be blank")
    private String image; // Id of the image uploaded by the user

    public ImageQuestion(ImageQuestion iq){
        super(iq);
        this.image = iq.getImage();
        this.type = QuestionType.ImageQuestion.toString();
    }

}

