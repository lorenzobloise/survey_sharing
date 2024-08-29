package it.lorenzobloise.survey_sharing_backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document("role")
@ToString
@EqualsAndHashCode
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Role {

    @Id
    private String id;
    @Indexed(unique = true)
    private String name;
    @DBRef(lazy = true)
    @JsonIgnore
    private List<User> users;

}
