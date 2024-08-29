package it.lorenzobloise.survey_sharing_backend.controllers;

import it.lorenzobloise.survey_sharing_backend.entities.Invitation;
import it.lorenzobloise.survey_sharing_backend.entities.User;
import it.lorenzobloise.survey_sharing_backend.services.InvitationService;
import it.lorenzobloise.survey_sharing_backend.support.ResponseMessage;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;

@RestController
@RequestMapping("/invitations")
@AllArgsConstructor
public class InvitationController {

    private final InvitationService invitationService;

    // POST

    @PostMapping
    public ResponseEntity createInvitations(@RequestParam String surveyTitle, @RequestBody @Valid List<Invitation> invitations){
        try{
            Set<Invitation> result = invitationService.addNewInvitationsToSurvey(surveyTitle, invitations);
            if(result.size()==0)
                return new ResponseEntity<>(new ResponseMessage("No result"), HttpStatus.OK);
            return new ResponseEntity(new ResponseMessage("Invitations sent correctly",result), HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    // GET

    @GetMapping("/search/all")
    public ResponseEntity findAllInvitations(Authentication connectedUser){
        try{
            Set<Invitation> result = invitationService.getAllInvitations(connectedUser);
            if(result.size()==0)
                return new ResponseEntity<>(new ResponseMessage("No result"), HttpStatus.OK);
            return new ResponseEntity(new ResponseMessage("",result), HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    @GetMapping("/search/by_id")
    public ResponseEntity findInvitationById(@RequestParam String invitationId){
        try{
            Invitation result = invitationService.getInvitationById(invitationId);
            return new ResponseEntity(new ResponseMessage("", result), HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    // DELETE

    @DeleteMapping
    public ResponseEntity deleteInvitation(@RequestParam String invitation){
        try {
            Invitation result = invitationService.removeInvitation(invitation);
            return new ResponseEntity(new ResponseMessage("Invitation deleted correctly",result), HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    // PUT

    @PutMapping
    public ResponseEntity updateInvitation(@RequestParam String invitation, @RequestParam boolean accepted, Authentication connectedUser){
        try {
            Invitation result = invitationService.updateInvitation(invitation, accepted, connectedUser);
            return new ResponseEntity(new ResponseMessage("",result), HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

}
