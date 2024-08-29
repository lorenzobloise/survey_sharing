package it.lorenzobloise.survey_sharing_backend.controllers;

import it.lorenzobloise.survey_sharing_backend.entities.Image;
import it.lorenzobloise.survey_sharing_backend.services.ImageService;
import it.lorenzobloise.survey_sharing_backend.support.ResponseMessage;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/images")
@AllArgsConstructor
public class ImageController {

    private ImageService imageService;

    // POST

    @PostMapping
    public ResponseEntity uploadImage(@RequestBody int[] image, @RequestParam String fileName){
        try{
            Image result = imageService.addImage(image, fileName);
            return new ResponseEntity(new ResponseMessage("Added successfully", result), HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    // GET

    @GetMapping
    public ResponseEntity findImageById(@RequestParam String imageId){
        try{
            Optional<Image> result = imageService.getImageById(imageId);
            if(result.isEmpty())
                return new ResponseEntity(new ResponseMessage("Image not found", null), HttpStatus.OK);
            return new ResponseEntity(new ResponseMessage("", result), HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

}
