package it.lorenzobloise.survey_sharing_backend.services;

import it.lorenzobloise.survey_sharing_backend.entities.User;
import it.lorenzobloise.survey_sharing_backend.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@AllArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;
    private final SurveyService surveyService;

    // POST

    public User addUser(User user){
        if(userRepository.existsByIdOrUsernameOrEmail(user.getId(), user.getUsername(), user.getEmail()))
            throw new RuntimeException("User already exists");
        return userRepository.save(user);
    }

    // GET

    public Set<User> getAllUsers(){
        return new TreeSet<>(userRepository.findAll());
    }

    public Set<User> getUsersByFirstnameAndLastname(String query){
        Set<User> result = new TreeSet<>();
        // Tokenize the query, separating name and surname
        StringTokenizer st = new StringTokenizer(query," ");
        List<String> tokens = new LinkedList<>();
        while(st.hasMoreTokens()) tokens.add(st.nextToken());
        for(String t: tokens){
            TreeSet<User> partial = new TreeSet<>(userRepository.findUsersByFirstnameContainingIgnoreCase(t));
            TreeSet<User> partial2 = new TreeSet<>(userRepository.findUsersByLastnameContainingIgnoreCase(t));
            partial.addAll(partial2);
            for(User u: partial) result.add(u);
        }
        return result;
    }

    public Set<User> getUsersByUsername(String username){
        return new TreeSet<>(userRepository.findUsersByUsernameContainingIgnoreCase(username));
    }

    public Optional<User> getUserByUsername(String username){
        return userRepository.findUserByIdOrUsernameOrEmail(username, username, username);
    }

    public Set<User> getUsersByEmail(String email){
        return new TreeSet<>(userRepository.findUsersByEmailContainingIgnoreCase(email));
    }

    public Optional<User> getUserByEmail(String email){
        return userRepository.findUserByIdOrUsernameOrEmail(email, email, email);
    }

    public Optional<User> getUserById(String id){
        return userRepository.findById(id);
    }

    // DELETE

    public Optional<User> removeUser(String user){
        Optional<User> result = userRepository.findUserByIdOrUsernameOrEmail(user, user, user);
        if(result.isEmpty())
            throw new RuntimeException("User does not exist");
        // Remove this user's created surveys
        for(String surveyTitle: result.get().getCreatedSurveys())
            surveyService.removeSurvey(surveyTitle);
        // Remove this user from the users repository
        result = userRepository.findUserByIdOrUsernameOrEmail(user, user, user);
        // In the midtime, its former value has been modified, so when I try to delete it from the repository,
        // the old version number doesn't match with the new one
        if(result.isEmpty())
            throw new RuntimeException("User does not exist");
        userRepository.delete(result.get());
        return result;
    }

}
