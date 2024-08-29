package it.lorenzobloise.survey_sharing_backend.controllers;

import it.lorenzobloise.survey_sharing_backend.entities.Question;
import it.lorenzobloise.survey_sharing_backend.services.QuestionService;
import it.lorenzobloise.survey_sharing_backend.support.ResponseMessage;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@RestController
@RequestMapping("/questions")
@AllArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @GetMapping
    public ResponseEntity findQuestionById(@RequestParam String questionId){
        try{
            Question result = questionService.getQuestion(questionId);
            return new ResponseEntity(new ResponseMessage("", result), HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

}
