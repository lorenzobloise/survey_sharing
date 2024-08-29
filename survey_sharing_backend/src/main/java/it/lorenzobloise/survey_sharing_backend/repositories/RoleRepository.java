package it.lorenzobloise.survey_sharing_backend.repositories;

import it.lorenzobloise.survey_sharing_backend.entities.Role;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface RoleRepository extends MongoRepository<Role,String> {

    Optional<Role> findByName(String name);

}
