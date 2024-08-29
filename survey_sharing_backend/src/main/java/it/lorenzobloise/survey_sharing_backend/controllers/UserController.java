package it.lorenzobloise.survey_sharing_backend.controllers;

import it.lorenzobloise.survey_sharing_backend.entities.Option;
import it.lorenzobloise.survey_sharing_backend.entities.User;
import it.lorenzobloise.survey_sharing_backend.services.UserService;
import it.lorenzobloise.survey_sharing_backend.support.ResponseMessage;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/users")
@AllArgsConstructor
public class UserController {

    private final UserService userService;

    // GET

    @GetMapping("/search/all")
    public ResponseEntity findAllUsers(){
        Set<User> result = userService.getAllUsers();
        if(result.size()==0)
            return new ResponseEntity<>(new ResponseMessage("No result"), HttpStatus.OK);
        return new ResponseEntity<>(new ResponseMessage("",result), HttpStatus.OK);
    }

    @GetMapping("/search/by_firstname_lastname")
    public ResponseEntity findUsersByFirstnameAndLastname(@RequestParam(required = false) String query){
        if(query==null)
            return findAllUsers();
        Set<User> result = userService.getUsersByFirstnameAndLastname(query);
        if(result.size()==0)
            return new ResponseEntity<>(new ResponseMessage("No result"), HttpStatus.OK);
        return new ResponseEntity<>(new ResponseMessage("",result), HttpStatus.OK);
    }

    @GetMapping("/search/by_username")
    public ResponseEntity findUsersByUsername(@RequestParam String username){
        Set<User> result = userService.getUsersByUsername(username);
        if(result.size()==0)
            return new ResponseEntity<>(new ResponseMessage("No result"), HttpStatus.OK);
        return new ResponseEntity<>(new ResponseMessage("",result), HttpStatus.OK);
    }

    @GetMapping("/search/single/by_username")
    public ResponseEntity findUserByUsername(@RequestParam String username){
        Optional<User> result = userService.getUserByUsername(username);
        if(result.isEmpty())
            return new ResponseEntity(new ResponseMessage("No result"), HttpStatus.OK);
        return new ResponseEntity(new ResponseMessage("", result), HttpStatus.OK);
    }

    @GetMapping("/search/by_email")
    public ResponseEntity findUsersByEmail(@RequestParam String email){
        Set<User> result = userService.getUsersByEmail(email);
        if(result.size()==0)
            return new ResponseEntity<>(new ResponseMessage("No result"), HttpStatus.OK);
        return new ResponseEntity<>(new ResponseMessage("",result), HttpStatus.OK);
    }

    @GetMapping("/search/single/by_email")
    public ResponseEntity findUserByEmail(@RequestParam String email){
        Optional<User> result = userService.getUserByEmail(email);
        if(result.isEmpty())
            return new ResponseEntity(new ResponseMessage("No result"), HttpStatus.OK);
        return new ResponseEntity(new ResponseMessage("", result), HttpStatus.OK);
    }

    @GetMapping("/search/by_id")
    public ResponseEntity findUserById(@RequestParam String id){
        Optional<User> result = userService.getUserById(id);
        if(result.isEmpty())
            return new ResponseEntity<>(new ResponseMessage("No result"), HttpStatus.OK);
        return new ResponseEntity<>(new ResponseMessage("",result.get()), HttpStatus.OK);
    }

    // DELETE

    @DeleteMapping
    public ResponseEntity deleteUser(@RequestParam String user){
        try{
            Optional<User> result = userService.removeUser(user);
            return new ResponseEntity(new ResponseMessage("Deleted successfully", result.get()), HttpStatus.OK);
        }catch (RuntimeException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

}
