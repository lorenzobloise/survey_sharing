package it.lorenzobloise.survey_sharing_backend.services;

import it.lorenzobloise.survey_sharing_backend.entities.Invitation;
import it.lorenzobloise.survey_sharing_backend.entities.Survey;
import it.lorenzobloise.survey_sharing_backend.entities.User;
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

@Service
@AllArgsConstructor
public class InvitationService {

    private InvitationRepository invitationRepository;
    private UserRepository userRepository;
    private SurveyRepository surveyRepository;

    // POST

    private Invitation addInvitation(Invitation invitation){
        if(invitation.getId()!=null && invitationRepository.existsById(invitation.getId()))
            throw new RuntimeException("Invitation already exists");
        Optional<User> receiver = userRepository.findUserByIdOrUsernameOrEmail(invitation.getUser(), invitation.getUser(), invitation.getUser());
        if(receiver.isEmpty())
            throw new RuntimeException("User does not exist");
        Invitation toSave = new Invitation(invitation);
        for(String surveyTitle: receiver.get().getAnswers().keySet())
            if(surveyTitle.equals(toSave.getSurvey()))
                toSave.setAccepted(true);
        Invitation i_saved = invitationRepository.save(toSave);
        receiver.get().getInvitations().add(i_saved.getId());
        userRepository.save(receiver.get());
        return i_saved;
    }

    public Set<Invitation> addNewInvitationsToSurvey(String surveyTitle, List<Invitation> invitations){
        Optional<Survey> opt_s = surveyRepository.findSurveyByTitle(surveyTitle);
        if(opt_s.isEmpty())
            throw new RuntimeException("Survey "+surveyTitle+" does not exist");
        for(Invitation i: invitations){
            // Add this invitation
            Invitation i_saved = addInvitation(i);
            opt_s.get().getInvitations().add(i_saved.getId());
        }
        surveyRepository.save(opt_s.get());
        Set<Invitation> result = new TreeSet<>();
        for(String inv_id: opt_s.get().getInvitations()){
            Optional<Invitation> opt_id = invitationRepository.findById(inv_id);
            if(opt_id.isEmpty())
                throw new RuntimeException("Invitation does not exist");
            result.add(opt_id.get());
        }
        return result;
    }

    // GET

    public Set<Invitation> getAllInvitations(Authentication connectedUser){
        User user = ((User)connectedUser.getPrincipal());
        Optional<User> u = userRepository.findUserByIdOrUsernameOrEmail(user.getId(), user.getUsername(), user.getEmail());
        if(u.isEmpty())
            throw new RuntimeException("User does not exist");
        Set<Invitation> result = new TreeSet<>();
        for(String inv: u.get().getInvitations()){
            Optional<Invitation> opt_inv = invitationRepository.findById(inv);
            if(opt_inv.isPresent())
                result.add(opt_inv.get());
        }
        return result;
    }

    public Invitation getInvitationById(String invitationId){
        Optional<Invitation> result = invitationRepository.findById(invitationId);
        if(result.isEmpty())
            throw new RuntimeException("No results");
        return result.get();
    }

    // DELETE

    public Invitation removeInvitation(String invitation){
        Optional<Invitation> result = invitationRepository.findById(invitation);
        if(result.isEmpty())
            throw new RuntimeException("Invitation does not exist");
        // Remove this invitation from its receiver's invitations
        Optional<User> opt_u = userRepository.findUserByIdOrUsernameOrEmail(result.get().getUser(), result.get().getUser(), result.get().getUser());
        if(opt_u.isEmpty())
            throw new RuntimeException("User does not exist");
        opt_u.get().getInvitations().remove(result.get().getId());
        userRepository.save(opt_u.get());
        // Remove this invitation from its survey's invitations
        Optional<Survey> opt_s = surveyRepository.findSurveyByTitle(result.get().getSurvey());
        if(opt_s.isEmpty())
            throw new RuntimeException("Survey does not exist");
        opt_s.get().getInvitations().remove(result.get().getId());
        surveyRepository.save(opt_s.get());
        // Remove this invitation from the invitations repository
        invitationRepository.delete(result.get());
        return result.get();
    }

    // PUT

    public Invitation updateInvitation(String invitation, boolean accepted, Authentication connectedUser){
        User user = ((User)connectedUser.getPrincipal());
        Optional<User> u = userRepository.findUserByIdOrUsernameOrEmail(user.getId(), user.getUsername(), user.getEmail());
        if(u.isEmpty())
            throw new RuntimeException("User does not exist");
        Optional<Invitation> i = invitationRepository.findById(invitation);
        if(i.isEmpty())
            throw new RuntimeException("Invitation does not exist");
        i.get().setAccepted(accepted);
        invitationRepository.save(i.get());
        userRepository.save(u.get());
        return i.get();
    }

}
