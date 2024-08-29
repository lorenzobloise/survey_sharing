package it.lorenzobloise.survey_sharing_backend.repositories;

import it.lorenzobloise.survey_sharing_backend.entities.Answer;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AnswerRepository extends MongoRepository<Answer, String> {
}
