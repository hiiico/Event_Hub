package com.eventhub.service;

import com.eventhub.dto.CommentDto;
import com.eventhub.dto.EventRequest;
import com.eventhub.dto.EventResponse;
import com.eventhub.dto.UserDto;
import com.eventhub.model.Comment;
import com.eventhub.model.Event;
import com.eventhub.model.User;
import com.eventhub.repository.CommentRepository;
import com.eventhub.repository.EventRepository;
import com.eventhub.repository.UserRepository;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;

    public EventService(EventRepository eventRepository, UserRepository userRepository, CommentRepository commentRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
    }

    public Page<EventResponse> getAllEvents(Pageable pageable) {
        return eventRepository.findAll(pageable).map(this::toResponse);
    }

    public EventResponse getEventById(String id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        return toResponse(event);
    }

    public EventResponse createEvent(EventRequest request, String organiserId) {
        if (request.getDateTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Event date cannot be in the past");
        }

        User organiser = userRepository.findById(organiserId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setDateTime(request.getDateTime());
        event.setLocation(request.getLocation());
        event.setCategory(request.getCategory());
        event.setOrganiser(organiser);
        event.setLatitude(request.getLatitude());
        event.setLongitude(request.getLongitude());
        event = eventRepository.save(event);
        return toResponse(event);
    }

    public EventResponse updateEvent(String id, EventRequest request, String userId) {
        if (request.getDateTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Event date cannot be in the past");
        }

        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        if (!event.getOrganiser().getId().equals(userId)) {
            throw new RuntimeException("Not authorised to update this event");
        }
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setDateTime(request.getDateTime());
        event.setLocation(request.getLocation());
        event.setCategory(request.getCategory());
        event.setLatitude(request.getLatitude());
        event.setLongitude(request.getLongitude());
        event = eventRepository.save(event);
        return toResponse(event);
    }

    public void deleteEvent(String id, String userId) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        if (!event.getOrganiser().getId().equals(userId)) {
            throw new RuntimeException("Not authorised to delete this event");
        }
        eventRepository.delete(event);
    }

    public void rsvpEvent(String eventId, String userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (event.getAttendees().contains(user)) {
            event.getAttendees().remove(user);
        } else {
            event.getAttendees().add(user);
        }
        eventRepository.save(event);
    }

    public Page<EventResponse> getEventsByOrganiser(String userId, Pageable pageable) {
        return eventRepository.findByOrganiserId(userId, pageable).map(this::toResponse);
    }

//    public Page<EventResponse> getEventsAttending(String userId, Pageable pageable) {
//        System.out.println("Querying attending events for user ID: " + userId);
//        Page<Event> events = eventRepository.findByAttendeeId(userId, pageable);
//        System.out.println("Found: " + events.getTotalElements());
//        return events.map(this::toResponse);
//    }

    public Page<EventResponse> getEventsAttending(String userId, Pageable pageable) {
        System.out.println("Querying attending events for user ID: " + userId);

        ObjectId objectId = new ObjectId(userId); // convert here

        Page<Event> events = eventRepository.findByAttendeeId(objectId, pageable);
        System.out.println("Found: " + events.getTotalElements());
        return events.map(this::toResponse);
    }

    private EventResponse toResponse(Event event) {
        EventResponse response = new EventResponse();
        response.setId(event.getId());
        response.setTitle(event.getTitle());
        response.setDescription(event.getDescription());
        response.setDateTime(event.getDateTime());
        response.setLocation(event.getLocation());
        response.setCategory(event.getCategory());
//        response.setAttendeeCount(event.getAttendees() != null ? event.getAttendees().size() : 0);
        response.setLatitude(event.getLatitude());
        response.setLongitude(event.getLongitude());

        // Handle organiser
        if (event.getOrganiser() != null) {
            UserDto organiserDto = new UserDto();
            organiserDto.setId(event.getOrganiser().getId());
            organiserDto.setName(event.getOrganiser().getName());
            organiserDto.setEmail(event.getOrganiser().getEmail());
            response.setOrganiser(organiserDto);
        } else {
            response.setOrganiser(null);
        }

        // Handle attendees list
        if (event.getAttendees() != null) {
            List<UserDto> attendeeDtos = event.getAttendees().stream()
                    .map(this::toUserDto)
                    .collect(Collectors.toList());
            response.setAttendees(attendeeDtos);
        }

        // Handle comments safely
        if (event.getComments() != null) {
            response.setComments(event.getComments().stream()
                    .map(this::toCommentDto)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toSet()));
        }
        return response;
    }

    // Add helper method to convert User to UserDto
    private UserDto toUserDto(User user) {
        if (user == null) return null;
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        return dto;
    }

    private CommentDto toCommentDto(Comment comment) {
        if (comment == null) return null;
        CommentDto dto = new CommentDto();
        dto.setId(comment.getId());
        dto.setText(comment.getText());
        dto.setCreatedAt(comment.getCreatedAt());

        // Handle null author (e.g., user deleted)
        if (comment.getAuthor() != null) {
            UserDto authorDto = new UserDto();
            authorDto.setId(comment.getAuthor().getId());
            authorDto.setName(comment.getAuthor().getName());
            authorDto.setEmail(comment.getAuthor().getEmail());
            dto.setAuthor(authorDto);
        } else {
            // Placeholder for missing user
            UserDto unknown = new UserDto();
            unknown.setId("unknown");
            unknown.setName("Deleted User");
            unknown.setEmail("");
            dto.setAuthor(unknown);
        }
        return dto;
    }

    public Comment addComment(String eventId, String text, String userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = new Comment();
        comment.setText(text);
        comment.setAuthor(user);
        comment.setEvent(event);
        comment.setCreatedAt(LocalDateTime.now());

        comment = commentRepository.save(comment);

        // Add comment to event's comment list
        if (event.getComments() == null) {
            event.setComments(new ArrayList<>());
        }
        event.getComments().add(comment);
        eventRepository.save(event);

        return comment;
    }
}