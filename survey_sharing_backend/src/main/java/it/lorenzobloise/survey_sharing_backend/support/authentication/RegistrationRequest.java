package it.lorenzobloise.survey_sharing_backend.support.authentication;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.*;

@Getter
@Setter
@Builder
public class RegistrationRequest {

    @NotEmpty(message = "Username shall not be blank")
    @NotBlank(message = "Username shall not be blank")
    private String username;
    @NotEmpty(message = "First name shall not be blank")
    @NotBlank(message = "First name shall not be blank")
    private String firstname;
    @NotEmpty(message = "Last name shall not be blank")
    @NotBlank(message = "Last name shall not be blank")
    private String lastname;
    @Email(message="Email is not valid", regexp="[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}", flags = Pattern.Flag.CASE_INSENSITIVE)
    @NotEmpty(message = "Email shall not be blank")
    @NotBlank(message = "Email shall not be blank")
    private String email;
    @NotEmpty(message = "Password shall not be blank")
    @NotBlank(message = "Password shall not be blank")
    @Size(min = 8, message = "Password should be at least 8 characters long")
    private String password;
    @NotEmpty(message = "Age shall not be blank")
    @NotBlank(message = "Age shall not be blank")
    private int age;
    @NotEmpty(message = "Gender shall not be blank")
    @NotBlank(message = "Gender shall not be blank")
    private String gender;
    @NotEmpty(message = "Country shall not be blank")
    @NotBlank(message = "Country shall not be blank")
    private String country;


}
