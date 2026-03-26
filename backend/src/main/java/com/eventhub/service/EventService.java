package com.eventhub.service;

import com.eventhub.dto.CommentDto;
import com.eventhub.dto.EventRequest;
import com.eventhub.dto.EventResponse;
import com.eventhub.dto.UserDto;
import com.eventhub.model.Comment;
import com.eventhub.model.Event;
import com.eventhub.model.User;
import com.eventhub.repository.EventRepository;
import com.eventhub.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public EventService(EventRepository eventRepository, UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
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
        User organiser = userRepository.findById(organiserId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setDateTime(request.getDateTime());
        event.setLocation(request.getLocation());
        event.setCategory(request.getCategory());
        event.setOrganiser(organiser);
        event = eventRepository.save(event);
        return toResponse(event);
    }

    public EventResponse updateEvent(String id, EventRequest request, String userId) {
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

    public Page<EventResponse> getEventsAttending(String userId, Pageable pageable) {
        return eventRepository.findByAttendeeId(userId, pageable).map(this::toResponse);
    }

    private EventResponse toResponse(Event event) {
        EventResponse response = new EventResponse();
        response.setId(event.getId());
        response.setTitle(event.getTitle());
        response.setDescription(event.getDescription());
        response.setDateTime(event.getDateTime());
        response.setLocation(event.getLocation());
        response.setCategory(event.getCategory());
        response.setAttendeeCount(event.getAttendees().size());

        UserDto organiserDto = new UserDto();
        organiserDto.setId(event.getOrganiser().getId());
        organiserDto.setName(event.getOrganiser().getName());
        organiserDto.setEmail(event.getOrganiser().getEmail());
        response.setOrganiser(organiserDto);

        if (event.getComments() != null) {
            response.setComments(event.getComments().stream().map(this::toCommentDto).collect(Collectors.toSet()));
        }
        return response;
    }

    private CommentDto toCommentDto(Comment comment) {
        CommentDto dto = new CommentDto();
        dto.setId(comment.getId());
        dto.setText(comment.getText());
        dto.setCreatedAt(comment.getCreatedAt());

        UserDto authorDto = new UserDto();
        authorDto.setId(comment.getAuthor().getId());
        authorDto.setName(comment.getAuthor().getName());
        authorDto.setEmail(comment.getAuthor().getEmail());
        dto.setAuthor(authorDto);

        return dto;
    }
}
