package it.lorenzobloise.survey_sharing_backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import it.lorenzobloise.survey_sharing_backend.support.Utils;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.security.auth.Subject;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Document("user")
@ToString
@EqualsAndHashCode
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User implements Comparable<User>, UserDetails, Principal {

    public enum Gender{Male, Female};
    @Id
    private String id;
    @Indexed(unique = true)
    private String username;
    private String firstname;
    private String lastname;
    @Indexed(unique = true)
    private String email;
    private String password;
    private int age;
    private Gender gender;
    private String country;
    private Set<String> createdSurveys; // Titles of the created surveys
    private Map<String,String> answers; // The key is the survey's title, so each user can only give one answer per survey, and the value is the answer's id
    private Set<String> invitations; // Ids of the invitations received
    @JsonIgnore
    private LocalDateTime registrationDateObj;
    private String[] registrationDate;
    @JsonIgnore
    @Version
    private Long version;
    @DBRef
     private List<Role> roles;

    public User(String username, String email, String password, String firstname, String lastname, int age, Gender gender, String country) {
        this.username = username;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.age = age;
        this.gender = gender;
        this.country = country;
        this.createdSurveys = new TreeSet<>();
        this.answers = new TreeMap<>();
        this.invitations = new TreeSet<>();
        this.registrationDateObj = LocalDateTime.now();
        this.registrationDate = Utils.parseDate(this.registrationDateObj.toString());
    }

    public User(String username, String email, String password, String firstname, String lastname, int age, Gender gender, String country, Set<String> createdSurveys, Map<String,String> answers) {
        this.username = username;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.age = age;
        this.gender = gender;
        this.country = country;
        this.createdSurveys = createdSurveys;
        this.answers = answers;
        this.invitations = new TreeSet<>();
        this.registrationDateObj = LocalDateTime.now();
        this.registrationDate = Utils.parseDate(this.registrationDateObj.toString());
    }

    public boolean equals(Object o){
        if(o==null) return false;
        if(o==this) return true;
        if(o instanceof User){
            User u = (User)o;
            return this.username.equals(u.getUsername()) || this.email.equals(u.getEmail());
        }
        return false;
    }

    public int compareTo(User u){
        if(this.equals(u)) return 0;
        return (this.firstname +this.lastname +this.username).compareTo(u.getFirstname()+u.getLastname()+u.getUsername());
    }

    // Implementing Principal's inherited methods

    @Override
    public String getName() {
        return this.username;
    }

    // Implementing UserDetails' inherited methods

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.roles
                .stream()
                .map(r -> new SimpleGrantedAuthority(r.getName()))
                .collect(Collectors.toList());
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

}
