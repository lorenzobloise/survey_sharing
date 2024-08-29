package it.lorenzobloise.survey_sharing_backend.services;

import it.lorenzobloise.survey_sharing_backend.entities.*;
import it.lorenzobloise.survey_sharing_backend.repositories.AnswerRepository;
import it.lorenzobloise.survey_sharing_backend.repositories.InvitationRepository;
import it.lorenzobloise.survey_sharing_backend.repositories.SurveyRepository;
import it.lorenzobloise.survey_sharing_backend.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.TreeSet;

@AllArgsConstructor
@Service
public class AnswerService {

    private final UserRepository userRepository;
    private final SurveyRepository surveyRepository;
    private final AnswerRepository answerRepository;
    private QuestionService questionService;
    private InvitationService invitationService;
    private InvitationRepository invitationRepository;

    // POST

    public Answer addAnswer(String survey, double rating, String feedback, List<Question> questions, Authentication connectedUser){
        User user = ((User)connectedUser.getPrincipal());
        Optional<User> u = userRepository.findUserByIdOrUsernameOrEmail(user.getId(), user.getUsername(), user.getEmail());
        if(u.isEmpty())
            throw new RuntimeException("User "+user+" does not exist");
        Optional<Survey> s = surveyRepository.findSurveyByTitle(survey);
        if(s.isEmpty())
            throw new RuntimeException("Survey "+survey+" does not exist");
        if(!u.get().getCreatedSurveys().isEmpty() && u.get().getCreatedSurveys().contains(s.get().getTitle()))
            throw new RuntimeException("Users cannot answer their own surveys");
        if(u.get().getAnswers().containsKey(survey))
            throw new RuntimeException("User has already answered this survey");
        try{
            // Create answer
            Answer answer = new Answer(user.getUsername(), survey, feedback, rating);
            // Save this answer's questions
            for(Question q: questions){
                Question q_saved = questionService.addQuestion(q);
                answer.getQuestions().add(q_saved.getId());
            }
            // Add this answer in the answers repository
            Answer result = answerRepository.save(answer);
            //Accept all the invitations received by this user for this survey
            Set<Invitation> invitations = invitationService.getAllInvitations(connectedUser);
            for(Invitation i: invitations)
                if(i.getSurvey().equals(survey)) {
                    i.setAccepted(true);
                    invitationRepository.save(i);
                }
            // Add this answer in the survey's answers
            s.get().getAnswers().add(result.getId());
            surveyRepository.save(s.get());
            // Add this answer in the user's answers
            u.get().getAnswers().put(s.get().getTitle(),result.getId());
            userRepository.save(u.get());
            return result;
        }catch (RuntimeException e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    // GET

    public Set<Answer> getAllAnswers(Authentication connectedUser){
        User user = ((User)connectedUser.getPrincipal());
        Optional<User> u = userRepository.findUserByIdOrUsernameOrEmail(user.getId(), user.getUsername(), user.getEmail());
        if(u.isEmpty())
            throw new RuntimeException("User does not exist");
        Set<Answer> result = new TreeSet<>();
        for(String answer_id: u.get().getAnswers().values()){
            Optional<Answer> opt_ans = answerRepository.findById(answer_id);
            if(opt_ans.isEmpty())
                throw new RuntimeException("Answer does not exist");
            result.add(opt_ans.get());
        }
        return result;
    }

    public Set<Answer> getAnswersBySurveyTitle(String surveyTitle, Authentication connectedUser){
        User user = ((User)connectedUser.getPrincipal());
        Optional<User> u = userRepository.findUserByIdOrUsernameOrEmail(user.getId(), user.getUsername(), user.getEmail());
        if(u.isEmpty())
            throw new RuntimeException("User does not exist");
        Set<String> keys = new TreeSet<>(u.get().getAnswers().keySet()); // Set #1: titles of the surveys answered by the user
        Set<Survey> matchSurveys = new TreeSet<>(surveyRepository.findSurveysByTitleContaining(surveyTitle)); // Titles of the surveys matching argument 'surveyTitle'
        Set<String> match = new TreeSet<>();
        for(Survey s: matchSurveys)
            match.add(s.getTitle()); // Set #2: surveys matching argument 'surveyTitle'
        keys.retainAll(match); // Intersection between the two sets
        Set<Answer> result = new TreeSet<>();
        for(String k: keys) {
            Optional<Answer> opt_ans = answerRepository.findById(u.get().getAnswers().get(k));
            if(opt_ans.isEmpty())
                throw new RuntimeException("Answer does not exist");
            result.add(opt_ans.get());
        }
        return result;
    }

    public Optional<Answer> getAnswerById(String answerId){
        return answerRepository.findById(answerId);
    }

    // DELETE

    public Optional<Answer> removeAnswer(String answer){
        Optional<Answer> a = answerRepository.findById(answer);
        if(a.isEmpty())
            throw new RuntimeException("Answer does not exist");
        Optional<Survey> s = surveyRepository.findSurveyByTitle(a.get().getSurvey());
        if(s.isEmpty())
            throw new RuntimeException("Answer belongs to no existing survey");
        // Remove this answer from the user's answers
        String user = a.get().getUser();
        Optional<User> u = userRepository.findUserByIdOrUsernameOrEmail(user, user, user);
        if(u.isEmpty())
            throw new RuntimeException("User does not exist");
        u.get().getAnswers().remove(a.get().getSurvey());
        userRepository.save(u.get());
        // Remove this answer from the survey's answers
        s.get().getAnswers().remove(a.get().getId());
        surveyRepository.save(s.get());
        // Remove this answer's questions
        for(String q: a.get().getQuestions())
            questionService.removeQuestion(q);
        // Remove this answer from the answers repository
        answerRepository.delete(a.get());
        return a;
    }

}

