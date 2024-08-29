package it.lorenzobloise.survey_sharing_backend.repositories;

import it.lorenzobloise.survey_sharing_backend.entities.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    List<User> findUsersByUsernameContainingIgnoreCase(String username);
    List<User> findUsersByFirstnameContainingIgnoreCase(String firstname);
    List<User> findUsersByLastnameContainingIgnoreCase(String lastname);
    List<User> findUsersByEmailContainingIgnoreCase(String email);
    Optional<User> findUserByIdOrUsernameOrEmail(String id, String username, String email);
    boolean existsByIdOrUsernameOrEmail(String id, String username, String email);

}
