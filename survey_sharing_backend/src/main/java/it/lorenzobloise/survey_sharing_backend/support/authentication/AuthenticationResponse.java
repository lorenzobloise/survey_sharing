package it.lorenzobloise.survey_sharing_backend.support.authentication;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AuthenticationResponse {

    private String token;

}
