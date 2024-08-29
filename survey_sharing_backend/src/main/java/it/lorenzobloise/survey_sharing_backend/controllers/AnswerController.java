package it.lorenzobloise.survey_sharing_backend.controllers;

import it.lorenzobloise.survey_sharing_backend.entities.Answer;
import it.lorenzobloise.survey_sharing_backend.entities.Option;
import it.lorenzobloise.survey_sharing_backend.entities.Question;
import it.lorenzobloise.survey_sharing_backend.services.AnswerService;
import it.lorenzobloise.survey_sharing_backend.support.ResponseMessage;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.TreeSet;

@RestController
@RequestMapping("/answers")
@AllArgsConstructor
public class AnswerController {

    private final AnswerService answerService;

    // POST

    @PostMapping("/create")
    public ResponseEntity createAnswer(@RequestParam String survey, @RequestParam double rating, @RequestParam String feedback,
                                       @RequestBody List<Question> questions, Authentication connectedUser){
        try{
            Answer result = answerService.addAnswer(survey, rating, feedback, questions, connectedUser);
            return new ResponseEntity(new ResponseMessage("Added successfully", result), HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    // GET

    @GetMapping("/search")
    public ResponseEntity findAllAnswers(Authentication connectedUser){
        try{
            Set<Answer> result = answerService.getAllAnswers(connectedUser);
            if(result.size()==0)
                return new ResponseEntity<>(new ResponseMessage("No result"), HttpStatus.OK);
            return new ResponseEntity(new ResponseMessage("",result), HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    @GetMapping("/search/by_survey_title")
    public ResponseEntity findAnswersBySurveyTitle(@RequestParam String surveyTitle, Authentication connectedUser){
        try{
            Set<Answer> result = answerService.getAnswersBySurveyTitle(surveyTitle, connectedUser);
            if(result.size()==0)
                return new ResponseEntity<>(new ResponseMessage("No result"), HttpStatus.OK);
            return new ResponseEntity(new ResponseMessage("",result), HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    @GetMapping("/search/by_id")
    public ResponseEntity findAnswerById(@RequestParam String answer_id){
        try{
            Optional<Answer> result = answerService.getAnswerById(answer_id);
            if(result.isEmpty())
                return new ResponseEntity(new ResponseMessage("No result"), HttpStatus.OK);
            return new ResponseEntity(new ResponseMessage("", result), HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    // DELETE

    @DeleteMapping("/{answer}")
    public ResponseEntity deleteAnswer(@PathVariable(value = "answer") String answer){
        try{
            Optional<Answer> result = answerService.removeAnswer(answer);
            return new ResponseEntity(new ResponseMessage("Deleted successfully", result.get()), HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

}
