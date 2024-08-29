package it.lorenzobloise.survey_sharing_backend.repositories;

import it.lorenzobloise.survey_sharing_backend.entities.Option;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface OptionRepository extends MongoRepository<Option, String> {
}
