package it.lorenzobloise.survey_sharing_backend.controllers;

import it.lorenzobloise.survey_sharing_backend.entities.Question;
import it.lorenzobloise.survey_sharing_backend.entities.Survey;
import it.lorenzobloise.survey_sharing_backend.services.SurveyService;
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

@RestController
@RequestMapping("/surveys")
@AllArgsConstructor
public class SurveyController {

    private final SurveyService surveyService;

    // POST

    @PostMapping(consumes = "application/json")
    public ResponseEntity createSurvey(@RequestParam String surveyTitle, @RequestBody List<Question> questions, Authentication connectedUser){
        try{
            return new ResponseEntity(new ResponseMessage("Created successfully",
                    surveyService.addSurvey(surveyTitle, questions, connectedUser)), HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    // GET

    @GetMapping("/search")
    public ResponseEntity findAllSurveys(@RequestParam boolean returnClosedSurveys){
        Set<Survey> result = surveyService.getAllSurveys(returnClosedSurveys);
        if(result.size()==0)
            return new ResponseEntity<>(new ResponseMessage("No result"), HttpStatus.OK);
        return new ResponseEntity<>(new ResponseMessage("",result), HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity findAllCreatedSurveys(@RequestParam boolean returnClosedSurveys, Authentication connectedUser){
        try{
            Set<Survey> result = surveyService.getAllCreatedSurveys(returnClosedSurveys, connectedUser);
            if(result.size()==0)
                return new ResponseEntity<>(new ResponseMessage("No result"), HttpStatus.OK);
            return new ResponseEntity<>(new ResponseMessage("",result), HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    @GetMapping("/search/by_owner")
    public ResponseEntity findAllSurveysByOwner(@RequestParam String owner, @RequestParam boolean returnClosedSurveys){
        try{
            Set<Survey> result = surveyService.getAllSurveysByOwner(owner, returnClosedSurveys);
            if(result.size()==0)
                return new ResponseEntity<>(new ResponseMessage("No result"), HttpStatus.OK);
            return new ResponseEntity<>(new ResponseMessage("",result), HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    @GetMapping("/search/by_title")
    public ResponseEntity findSurveysByTitle(@RequestParam String surveyTitle, @RequestParam boolean returnClosedSurveys){
        try{
            Set<Survey> result = surveyService.getSurveysByTitle(surveyTitle, returnClosedSurveys);
            if(result.size()==0)
                return new ResponseEntity<>(new ResponseMessage("No result"), HttpStatus.OK);
            return new ResponseEntity<>(new ResponseMessage("",result), HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    @GetMapping("/search/single/by_title")
    public ResponseEntity findSurveyByTitle(@RequestParam String surveyTitle, @RequestParam boolean returnClosedSurveys){
        try{
            Optional<Survey> result = surveyService.getSurveyByTitle(surveyTitle, returnClosedSurveys);
            if(result==null || result.isEmpty())
                return new ResponseEntity<>(new ResponseMessage("No result"), HttpStatus.OK);
            return new ResponseEntity<>(new ResponseMessage("",result), HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    // PUT

    @PutMapping
    public ResponseEntity closeSurvey(@RequestParam String surveyTitle){
        try{
            Survey result = surveyService.closeSurvey(surveyTitle);
            return new ResponseEntity(new ResponseMessage("Survey closed", result), HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    // DELETE

    @DeleteMapping
    public ResponseEntity deleteCreatedSurvey(@RequestParam String surveyTitle){
        //TODO
        // If the user is authenticated, invoke the method below "deleteSurvey(String surveyTitle)"
        try{
            Optional<Survey> result = surveyService.removeSurvey(surveyTitle);
            return new ResponseEntity(new ResponseMessage("Deleted successfully", result.get()), HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

}
