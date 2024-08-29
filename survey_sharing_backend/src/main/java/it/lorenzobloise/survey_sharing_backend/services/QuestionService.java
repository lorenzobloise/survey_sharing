package it.lorenzobloise.survey_sharing_backend.services;

import it.lorenzobloise.survey_sharing_backend.entities.ImageQuestion;
import it.lorenzobloise.survey_sharing_backend.entities.MultipleChoiceQuestion;
import it.lorenzobloise.survey_sharing_backend.entities.OpenEndedQuestion;
import it.lorenzobloise.survey_sharing_backend.entities.Question;
import it.lorenzobloise.survey_sharing_backend.repositories.OptionRepository;
import it.lorenzobloise.survey_sharing_backend.repositories.QuestionRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@AllArgsConstructor
@Service
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final OptionRepository optionRepository;
    private final ImageService imageService;

    // POST

    public Question addQuestion(Question q){
        if(q.getType().equals("ImageQuestion")){
            ImageQuestion q2 = (ImageQuestion) q;
            ImageQuestion tmp = new ImageQuestion(q2);
            // Add this question in the questions repository
            ImageQuestion q_saved = questionRepository.save(tmp);
            return q_saved;
        }
        if(q.getType().equals("OpenEndedQuestion")){
            OpenEndedQuestion q2 = (OpenEndedQuestion) q;
            OpenEndedQuestion tmp = new OpenEndedQuestion(q2);
            // Add this question in the questions repository
            OpenEndedQuestion q_saved = questionRepository.save(tmp);
            return q_saved;
        }
        if(q.getType().equals("MultipleChoiceQuestion")) {
            MultipleChoiceQuestion q2 = (MultipleChoiceQuestion) q;
            MultipleChoiceQuestion tmp = new MultipleChoiceQuestion(q2);
            tmp.setOptions(q2.getOptions());
            // Add all this question's options in the options repository
            optionRepository.saveAll(tmp.getOptions());
            // Add this question in the questions repository
            MultipleChoiceQuestion q_saved = questionRepository.save(tmp);
            return q_saved;
        }
        return null;
    }

    // GET

    public Question getQuestion(String question_id){
        Optional<Question> opt_q = questionRepository.findById(question_id);
        if(opt_q.isEmpty())
            throw new RuntimeException("Question does not exist");
        return opt_q.get();
    }

    // DELETE

    public void removeQuestion(String question_id){
        Optional<Question> opt_q = questionRepository.findById(question_id);
        if(opt_q.isEmpty())
            throw new RuntimeException("Question does not exist");
        if(opt_q.get().getType().equals("MutipleChoiceQuestion"))
            // Remove all options in this question from the options repository, if it is a MultipleChoiceQuestion
            optionRepository.deleteAll(((MultipleChoiceQuestion)(opt_q.get())).getOptions());
        if(opt_q.get().getType().equals("ImageQuestion")) {
            // Remove the image associated to this question only if it is present
            String image = ((ImageQuestion) (opt_q.get())).getImage();
            if(image!=null) imageService.deleteImage(image);
        }
        // Remove this question from the questions repository
        questionRepository.delete(opt_q.get());
    }

}