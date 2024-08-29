package it.lorenzobloise.survey_sharing_backend.repositories;

import it.lorenzobloise.survey_sharing_backend.entities.Survey;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface SurveyRepository extends MongoRepository<Survey, String> {

    Optional<Survey> findSurveyByTitle(String title);
    List<Survey> findSurveysByTitleContaining(String title);

}
