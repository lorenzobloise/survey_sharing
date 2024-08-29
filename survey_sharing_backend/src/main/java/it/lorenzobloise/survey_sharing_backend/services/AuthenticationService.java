package it.lorenzobloise.survey_sharing_backend.services;

import it.lorenzobloise.survey_sharing_backend.entities.User;
import it.lorenzobloise.survey_sharing_backend.repositories.RoleRepository;
import it.lorenzobloise.survey_sharing_backend.support.Utils;
import it.lorenzobloise.survey_sharing_backend.support.authentication.AuthenticationRequest;
import it.lorenzobloise.survey_sharing_backend.support.authentication.AuthenticationResponse;
import it.lorenzobloise.survey_sharing_backend.support.authentication.RegistrationRequest;
import it.lorenzobloise.survey_sharing_backend.support.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.TreeMap;
import java.util.TreeSet;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public User register(RegistrationRequest request){
        var userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new IllegalStateException("ROLE USER was not initialized"));
        try {
            User.Gender genderConverted = User.Gender.valueOf(request.getGender());
            LocalDateTime registrationDateObj = LocalDateTime.now();
            var user = User.builder()
                    .username(request.getUsername())
                    .firstname(request.getFirstname())
                    .lastname(request.getLastname())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .gender(genderConverted)
                    .age(request.getAge())
                    .country(request.getCountry())
                    .registrationDateObj(registrationDateObj)
                    .registrationDate(Utils.parseDate(registrationDateObj.toString()))
                    .createdSurveys(new TreeSet<>())
                    .answers(new TreeMap<>())
                    .invitations(new TreeSet<>())
                    .roles(List.of(userRole))
                    .build();
            return userService.addUser(user);
        }catch (IllegalArgumentException e){
            throw new RuntimeException("Gender "+request.getGender()+" is not supported");
        }
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request){
        var auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        var claims = new HashMap<String, Object>();
        var user = ((User) auth.getPrincipal());
        claims.put("fullName", user.getFirstname() + " " + user.getLastname());
        var jwtToken = jwtService.generateToken(claims, user);
        return AuthenticationResponse.builder().token(jwtToken).build();
    }

}
