package com.eventhub.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
public class EventResponse {
    private String id;
    private String title;
    private String description;
    private LocalDateTime dateTime;
    private String location;
    private String category;
    private UserDto organiser;
//    private Integer attendeeCount;
    private List<UserDto> attendees;
    private Set<CommentDto> comments;
    private Double latitude;
    private Double longitude;
}
