package it.lorenzobloise.survey_sharing_backend;

import it.lorenzobloise.survey_sharing_backend.entities.Role;
import it.lorenzobloise.survey_sharing_backend.repositories.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class SurveySharingBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(SurveySharingBackendApplication.class, args);
    }

    @Bean
    public CommandLineRunner runner(RoleRepository roleRepository){
        return args -> {
            if(roleRepository.findByName("USER").isEmpty()){
                roleRepository.save(
                        Role.builder().name("USER").build()
                );
            }
        };
    }

}
