package it.lorenzobloise.survey_sharing_backend.repositories;

import it.lorenzobloise.survey_sharing_backend.entities.Invitation;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface InvitationRepository extends MongoRepository<Invitation, String> {
}
