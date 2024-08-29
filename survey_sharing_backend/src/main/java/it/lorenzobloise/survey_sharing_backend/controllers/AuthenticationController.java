package it.lorenzobloise.survey_sharing_backend.controllers;

import it.lorenzobloise.survey_sharing_backend.entities.User;
import it.lorenzobloise.survey_sharing_backend.services.AuthenticationService;
import it.lorenzobloise.survey_sharing_backend.support.authentication.AuthenticationRequest;
import it.lorenzobloise.survey_sharing_backend.support.authentication.AuthenticationResponse;
import it.lorenzobloise.survey_sharing_backend.support.authentication.RegistrationRequest;
import it.lorenzobloise.survey_sharing_backend.support.ResponseMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody @Valid RegistrationRequest request) {
        try{
            User result = authenticationService.register(request);
            return new ResponseEntity(new ResponseMessage("Registered successfully", result), HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    @PostMapping("/authenticate")
    public ResponseEntity authenticate(@RequestBody @Valid AuthenticationRequest request) {
        try {
            AuthenticationResponse result = authenticationService.authenticate(request);
            return new ResponseEntity(new ResponseMessage("User authenticated", result), HttpStatus.OK);
        }catch (RuntimeException e){
            return new ResponseEntity(new ResponseMessage("Username or password incorrect", null), HttpStatus.OK);
        }
    }

}
