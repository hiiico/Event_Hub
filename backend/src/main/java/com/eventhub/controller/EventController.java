package com.eventhub.controller;

import com.eventhub.dto.*;
import com.eventhub.model.Comment;
import com.eventhub.repository.UserRepository;
import com.eventhub.service.EventService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;
    private final UserRepository userRepository;

    public EventController(EventService eventService, UserRepository userRepository) {
        this.eventService = eventService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<Page<EventResponse>> getAllEvents(Pageable pageable) {
        return ResponseEntity.ok(eventService.getAllEvents(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventResponse> getEvent(@PathVariable String id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    @PostMapping
    public ResponseEntity<EventResponse> createEvent(@RequestBody EventRequest request,
                                                     @AuthenticationPrincipal UserDetails userDetails) {
        String userId = getUserIdFromPrincipal(userDetails);
        return ResponseEntity.ok(eventService.createEvent(request, userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventResponse> updateEvent(@PathVariable String id,
                                                     @RequestBody EventRequest request,
                                                     @AuthenticationPrincipal UserDetails userDetails) {
        String userId = getUserIdFromPrincipal(userDetails);
        return ResponseEntity.ok(eventService.updateEvent(id, request, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable String id,
                                            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = getUserIdFromPrincipal(userDetails);
        eventService.deleteEvent(id, userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/rsvp")
    public ResponseEntity<Void> rsvpEvent(@PathVariable String id,
                                          @AuthenticationPrincipal UserDetails userDetails) {
        String userId = getUserIdFromPrincipal(userDetails);
        eventService.rsvpEvent(id, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/created")
    public ResponseEntity<Page<EventResponse>> getMyCreatedEvents(Pageable pageable,
                                                                  @AuthenticationPrincipal UserDetails userDetails) {
        String userId = getUserIdFromPrincipal(userDetails);
        return ResponseEntity.ok(eventService.getEventsByOrganiser(userId, pageable));
    }

    @GetMapping("/user/attending")
    public ResponseEntity<Page<EventResponse>> getMyAttendingEvents(Pageable pageable,
                                                                    @AuthenticationPrincipal UserDetails userDetails) {
        String userId = getUserIdFromPrincipal(userDetails);
        return ResponseEntity.ok(eventService.getEventsAttending(userId, pageable));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<CommentDto> addComment(@PathVariable String id,
                                                 @Valid @RequestBody CommentRequest request,
                                                 @AuthenticationPrincipal UserDetails userDetails) {
        String userId = getUserIdFromPrincipal(userDetails);
        Comment comment = eventService.addComment(id, request.getText(), userId);
        return ResponseEntity.ok(convertToCommentDto(comment));
    }

    private CommentDto convertToCommentDto(Comment comment) {
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

    private String getUserIdFromPrincipal(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }
}