package com.eventhub.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    private String id;

    private String name;
    private String email;
    private String password;
    private String profileSettings;

    @DBRef
    private List<Event> createdEvents = new ArrayList<>();

    @DBRef
    private List<Event> attendingEvents = new ArrayList<>();

    @DBRef
    private List<Comment> comments = new ArrayList<>();
}
