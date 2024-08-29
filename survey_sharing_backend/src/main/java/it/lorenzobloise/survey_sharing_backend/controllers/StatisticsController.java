package it.lorenzobloise.survey_sharing_backend.controllers;

import it.lorenzobloise.survey_sharing_backend.entities.Statistics;
import it.lorenzobloise.survey_sharing_backend.services.StatisticsService;
import it.lorenzobloise.survey_sharing_backend.support.ResponseMessage;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/statistics")
@AllArgsConstructor
public class StatisticsController {

    private final StatisticsService statisticsService;

    @GetMapping()
    public ResponseEntity computeStatistics(@RequestParam String surveyTitle){
        try{
            Statistics result = statisticsService.getStatistics(surveyTitle);
            return new ResponseEntity(new ResponseMessage("",result), HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    @GetMapping("/averageRating")
    public ResponseEntity computeAverageRating(@RequestParam String surveyTitle){
        try{
            double result = statisticsService.getAverageRating(surveyTitle);
            return new ResponseEntity(new ResponseMessage("", result), HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

}
