package it.lorenzobloise.survey_sharing_backend.services;

import it.lorenzobloise.survey_sharing_backend.entities.Question;
import it.lorenzobloise.survey_sharing_backend.entities.Survey;
import it.lorenzobloise.survey_sharing_backend.entities.User;
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
public class SurveyService {

    private final UserRepository userRepository;
    private final SurveyRepository surveyRepository;
    private final AnswerService answerService;
    private final InvitationService invitationService;
    private final StatisticsService statisticsService;
    private final QuestionService questionService;

    // POST

    public Survey addSurvey(String surveyTitle, List<Question> questions, Authentication connectedUser){
        User user = ((User)connectedUser.getPrincipal());
        Optional<User> u = userRepository.findUserByIdOrUsernameOrEmail(user.getId(), user.getUsername(), user.getEmail());
        if(u.isEmpty())
            throw new RuntimeException("User does not exist");
        if(surveyRepository.findSurveyByTitle(surveyTitle).isPresent())
            throw new RuntimeException("Survey already exists");
        try {
            // Create survey
            Survey survey = new Survey(u.get().getUsername(), surveyTitle);
            // Add this survey to the surveys repository
            Survey result = surveyRepository.save(survey);
            // Add questions
            for(Question q: questions){
                Question q_saved = questionService.addQuestion(q);
                survey.getQuestions().add(q_saved.getId());
            }
            // Add this survey to the user's created surveys
            u.get().getCreatedSurveys().add(result.getTitle());
            userRepository.save(u.get());
            return surveyRepository.save(result);
        }catch (IllegalArgumentException e){
            throw new RuntimeException("Survey type is not supported");
        }catch (RuntimeException e){
            throw new RuntimeException(e);
        }
    }

    // GET

    public Set<Survey> getAllSurveys(boolean returnClosedSurveys){
        Set<Survey> partial = new TreeSet<>(surveyRepository.findAll());
        Set<Survey> result = new TreeSet<>();
        if(!returnClosedSurveys) {
            for (Survey s : partial)
                if (!s.isClosed())
                    result.add(s);
            return result;
        }
        return partial;
    }

    public Set<Survey> getAllCreatedSurveys(boolean returnClosedSurveys, Authentication connectedUser){
        User user = ((User)connectedUser.getPrincipal());
        return this.getAllSurveysByOwner(user.getUsername(), returnClosedSurveys);
    }

    public Set<Survey> getAllSurveysByOwner(String owner, boolean returnClosedSurveys){
        Optional<User> opt_u = userRepository.findUserByIdOrUsernameOrEmail(owner, owner, owner);
        if(opt_u.isEmpty())
            throw new RuntimeException("User "+owner+" does not exist");
        Set<Survey> partial = new TreeSet<>();
        for(String surveyTitle: opt_u.get().getCreatedSurveys()){
            Optional<Survey> opt_s = surveyRepository.findSurveyByTitle(surveyTitle);
            if(opt_s.isEmpty())
                throw new RuntimeException("Survey "+surveyTitle+" does not exist");
            partial.add(opt_s.get());
        }
        Set<Survey> result = new TreeSet<>();
        if(!returnClosedSurveys) {
            for (Survey s : partial)
                if (!s.isClosed())
                    result.add(s);
            return result;
        }
        return partial;
    }

    public Set<Survey> getSurveysByTitle(String surveyTitle, boolean returnClosedSurveys){
        Set<Survey> partial = new TreeSet<>(surveyRepository.findSurveysByTitleContaining(surveyTitle));
        Set<Survey> result = new TreeSet<>();
        if(!returnClosedSurveys) {
            for (Survey s : partial)
                if (!s.isClosed())
                    result.add(s);
            return result;
        }
        return partial;
    }

    public Optional<Survey> getSurveyByTitle(String surveyTitle, boolean returnClosedSurveys){
        Optional<Survey> result = surveyRepository.findSurveyByTitle(surveyTitle);
        if(!returnClosedSurveys && result.get().isClosed())
            return null;
        return result;
    }

    // PUT

    public Survey closeSurvey(String surveyTitle){
        Optional<Survey> survey = surveyRepository.findSurveyByTitle(surveyTitle);
        if(survey.isEmpty())
            throw new RuntimeException("Survey does not exist");
        if(survey.get().isClosed())
            throw new RuntimeException("Survey is already closed");
        survey.get().close();
        Survey result = surveyRepository.save(survey.get());
        return result;
    }

    // DELETE

    public Optional<Survey> removeSurvey(String surveyTitle){
        Optional<Survey> opt_s = surveyRepository.findSurveyByTitle(surveyTitle);
        if(opt_s.isEmpty())
            throw new RuntimeException("Survey "+surveyTitle+" does not exist");
        // Remove this survey from the owner's created surveys
        Optional<User> opt_u = userRepository.findUserByIdOrUsernameOrEmail(opt_s.get().getOwner(), opt_s.get().getOwner(), opt_s.get().getOwner());
        if(opt_u.isEmpty())
            throw new RuntimeException("User "+opt_s.get().getOwner()+" does not exist");
        opt_u.get().getCreatedSurveys().remove(opt_s.get().getTitle());
        userRepository.save(opt_u.get());
        // Remove all invitations related to this survey
        for(String i: opt_s.get().getInvitations())
            invitationService.removeInvitation(i);
        // Remove all answers given to this survey
        for(String a: opt_s.get().getAnswers())
            answerService.removeAnswer(a);
        // Remove all questions in this survey
        for(String q: opt_s.get().getQuestions())
            questionService.removeQuestion(q);
        // Remove this survey's statistics from the statistics repository
        statisticsService.removeStatistics(surveyTitle);
        opt_s = surveyRepository.findSurveyByTitle(surveyTitle); // In the midtime, its former value has been modified, so when I try to delete it from the repository,
        // the old version number doesn't match with the new one
        if(opt_s.isEmpty())
            throw new RuntimeException("Survey "+surveyTitle+" does not exist");
        // Remove this survey from the surveys repository
        surveyRepository.delete(opt_s.get());
        return opt_s;
    }

}
