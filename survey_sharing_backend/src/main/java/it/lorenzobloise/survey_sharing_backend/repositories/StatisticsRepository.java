package it.lorenzobloise.survey_sharing_backend.repositories;

import it.lorenzobloise.survey_sharing_backend.entities.Statistics;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface StatisticsRepository extends MongoRepository<Statistics, String> {

    Optional<Statistics> findStatisticsBySurvey(String survey);

}
