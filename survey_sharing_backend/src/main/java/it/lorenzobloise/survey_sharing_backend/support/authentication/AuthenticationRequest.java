package it.lorenzobloise.survey_sharing_backend.support.authentication;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

@Getter
@Setter
@Builder
public class AuthenticationRequest {

    @NotEmpty(message = "Username shall not be blank")
    @NotBlank(message = "Username shall not be blank")
    private String username;
    @NotEmpty(message = "Password shall not be blank")
    @NotBlank(message = "First name shall not be blank")
    @Size(min = 8, message = "Password should be at least 8 characters long")
    private String password;

}
