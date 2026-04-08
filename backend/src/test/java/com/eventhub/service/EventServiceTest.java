package com.eventhub.service;

import com.eventhub.dto.EventRequest;
import com.eventhub.dto.EventResponse;
import com.eventhub.model.Event;
import com.eventhub.model.User;
import com.eventhub.repository.EventRepository;
import com.eventhub.repository.UserRepository;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EventServiceTest {

    @Mock
    private EventRepository eventRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private EventService eventService;

    private User organiser;
    private Event event;

    @BeforeEach
    void setUp() {
        organiser = new User();
        organiser.setId("user123");
        organiser.setName("Organiser");

        event = new Event();
        event.setId("event123");
        event.setTitle("Test Event");
        event.setDateTime(LocalDateTime.now().plusDays(1));
        event.setLocation("Test Location");
        event.setOrganiser(organiser);
    }

    @Test
    void getAllEvents_shouldReturnPage() {
        Page<Event> page = new PageImpl<>(List.of(event));
        when(eventRepository.findAll(any(PageRequest.class))).thenReturn(page);

        Page<EventResponse> result = eventService.getAllEvents(PageRequest.of(0, 10));

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getTitle()).isEqualTo("Test Event");
    }

    @Test
    void getEventById_shouldReturnEvent() {
        when(eventRepository.findById("event123")).thenReturn(Optional.of(event));

        EventResponse result = eventService.getEventById("event123");

        assertThat(result.getTitle()).isEqualTo("Test Event");
    }

    @Test
    void getEventById_shouldThrowWhenNotFound() {
        when(eventRepository.findById("invalid")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> eventService.getEventById("invalid"))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Event not found");
    }

    @Test
    void createEvent_shouldSaveAndReturn() {
        EventRequest request = new EventRequest();
        request.setTitle("New Event");
        request.setDateTime(LocalDateTime.now().plusDays(1));
        request.setLocation("Somewhere");

        when(userRepository.findById("user123")).thenReturn(Optional.of(organiser));
        when(eventRepository.save(any(Event.class))).thenReturn(event);

        EventResponse response = eventService.createEvent(request, "user123");

        assertThat(response.getTitle()).isEqualTo("Test Event");
        verify(eventRepository).save(any(Event.class));
    }

    @Test
    void updateEvent_shouldUpdateWhenOwner() {
        EventRequest request = new EventRequest();
        request.setTitle("Updated Title");
        request.setDateTime(LocalDateTime.now().plusDays(1));
        request.setLocation("Updated Location");

        // The service will update the event and save it.
        // We need to return an updated event when save is called.
        Event updatedEvent = new Event();
        updatedEvent.setId("event123");
        updatedEvent.setTitle("Updated Title");
        updatedEvent.setDateTime(request.getDateTime());
        updatedEvent.setLocation(request.getLocation());
        updatedEvent.setOrganiser(organiser);

        when(eventRepository.findById("event123")).thenReturn(Optional.of(event));
        when(eventRepository.save(any(Event.class))).thenReturn(updatedEvent);

        EventResponse response = eventService.updateEvent("event123", request, "user123");

        // Expect the updated title
        assertThat(response.getTitle()).isEqualTo("Updated Title");
        verify(eventRepository).save(event);
    }

    @Test
    void updateEvent_shouldThrowWhenNotOwner() {
        // Must provide a valid EventRequest to avoid NPE in the service
        EventRequest request = new EventRequest();
        request.setTitle("Any Title");
        request.setDateTime(LocalDateTime.now().plusDays(1));
        request.setLocation("Any Location");

        when(eventRepository.findById("event123")).thenReturn(Optional.of(event));

        assertThatThrownBy(() -> eventService.updateEvent("event123", request, "wrongUser"))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Not authorised to update this event");
    }

    @Test
    void deleteEvent_shouldDeleteWhenOwner() {
        when(eventRepository.findById("event123")).thenReturn(Optional.of(event));
        eventService.deleteEvent("event123", "user123");
        verify(eventRepository).delete(event);
    }

    @Test
    void deleteEvent_shouldThrowWhenNotOwner() {
        when(eventRepository.findById("event123")).thenReturn(Optional.of(event));
        assertThatThrownBy(() -> eventService.deleteEvent("event123", "wrongUser"))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Not authorised to delete this event");
    }

    @Test
    void rsvpEvent_shouldAddUserToAttendees() {
        User user = new User();
        user.setId("user123");

        when(eventRepository.findById("event123")).thenReturn(Optional.of(event));
        when(userRepository.findById("user123")).thenReturn(Optional.of(user));

        eventService.rsvpEvent("event123", "user123");

        assertThat(event.getAttendees()).contains(user);
        verify(eventRepository).save(event);
    }

    @Test
    void rsvpEvent_shouldRemoveUserWhenAlreadyAttending() {
        User user = new User();
        user.setId("user123");
        event.getAttendees().add(user);

        when(eventRepository.findById("event123")).thenReturn(Optional.of(event));
        when(userRepository.findById("user123")).thenReturn(Optional.of(user));

        eventService.rsvpEvent("event123", "user123");

        assertThat(event.getAttendees()).doesNotContain(user);
        verify(eventRepository).save(event);
    }

    @Test
    void getEventsByOrganiser_shouldReturnEvents() {
        Page<Event> page = new PageImpl<>(List.of(event));
        when(eventRepository.findByOrganiserId("user123", PageRequest.of(0, 10))).thenReturn(page);

        Page<EventResponse> result = eventService.getEventsByOrganiser("user123", PageRequest.of(0, 10));

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getTitle()).isEqualTo("Test Event");
    }

    @Test
    void getEventsAttending_shouldReturnEvents() {
        Page<Event> page = new PageImpl<>(List.of(event));
        // Use a valid 24-character hex string
        String validUserId = "507f1f77bcf86cd799439011";
        when(eventRepository.findByAttendeeId(any(ObjectId.class), eq(PageRequest.of(0, 10)))).thenReturn(page);

        Page<EventResponse> result = eventService.getEventsAttending(validUserId, PageRequest.of(0, 10));

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getTitle()).isEqualTo("Test Event");
    }
}