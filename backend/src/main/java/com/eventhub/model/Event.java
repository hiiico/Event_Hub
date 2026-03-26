package com.eventhub.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Event {
    @Id
    private String id;

    private String title;
    private String description;
    private LocalDateTime dateTime;
    private String location;
    private String category;

    @DBRef
    private User organiser;

    @DBRef
    private List<User> attendees = new ArrayList<>();

    @DBRef
    private List<Comment> comments = new ArrayList<>();
}
