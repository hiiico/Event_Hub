package com.eventhub.controller;

import com.eventhub.dto.EventRequest;
import com.eventhub.dto.EventResponse;
import com.eventhub.model.User;
import com.eventhub.repository.UserRepository;
import com.eventhub.secutity.JwtUtil;
import com.eventhub.service.EventService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(EventController.class)
@AutoConfigureMockMvc(addFilters = false)   // disable CSRF and other security filters
public class EventControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EventService eventService;

    @MockBean
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        User testUser = new User();
        testUser.setId("user123");
        testUser.setEmail("user");
        testUser.setName("Test User");
        when(userRepository.findByEmail("user")).thenReturn(Optional.of(testUser));

        // Manually create an authenticated user in the security context
        org.springframework.security.core.userdetails.User principal =
                new org.springframework.security.core.userdetails.User("user", "", Collections.emptyList());
        Authentication authentication = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    @Test
    void getAllEvents_shouldReturnOk() throws Exception {
        when(eventService.getAllEvents(any())).thenReturn(new PageImpl<>(Collections.emptyList()));
        mockMvc.perform(get("/api/events"))
                .andExpect(status().isOk());
    }

    @Test
    void getEventById_shouldReturnOk() throws Exception {
        EventResponse response = new EventResponse();
        response.setId("123");
        response.setTitle("Test");
        when(eventService.getEventById("123")).thenReturn(response);

        mockMvc.perform(get("/api/events/123"))
                .andExpect(status().isOk());
    }

    @Test
    void createEvent_shouldReturnOk() throws Exception {
        EventRequest request = new EventRequest();
        request.setTitle("New Event");
        request.setDateTime(LocalDateTime.now().plusDays(1));
        request.setLocation("Here");

        EventResponse response = new EventResponse();
        response.setId("456");
        when(eventService.createEvent(any(), any())).thenReturn(response);

        mockMvc.perform(post("/api/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void updateEvent_shouldReturnOk() throws Exception {
        EventRequest request = new EventRequest();
        request.setTitle("Updated");
        request.setDateTime(LocalDateTime.now().plusDays(1));
        request.setLocation("There");

        EventResponse response = new EventResponse();
        response.setId("123");
        when(eventService.updateEvent(eq("123"), any(), any())).thenReturn(response);

        mockMvc.perform(put("/api/events/123")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void deleteEvent_shouldReturnNoContent() throws Exception {
        doNothing().when(eventService).deleteEvent("123", "user123");

        mockMvc.perform(delete("/api/events/123"))
                .andExpect(status().isNoContent());
    }

    @Test
    void rsvpEvent_shouldReturnOk() throws Exception {
        doNothing().when(eventService).rsvpEvent("123", "user123");

        mockMvc.perform(post("/api/events/123/rsvp"))
                .andExpect(status().isOk());
    }

    @Test
    void getMyCreatedEvents_shouldReturnOk() throws Exception {
        when(eventService.getEventsByOrganiser(eq("user123"), any()))
                .thenReturn(new PageImpl<>(Collections.emptyList()));

        mockMvc.perform(get("/api/events/user/created"))
                .andExpect(status().isOk());
    }

    @Test
    void getMyAttendingEvents_shouldReturnOk() throws Exception {
        when(eventService.getEventsAttending(eq("user123"), any()))
                .thenReturn(new PageImpl<>(Collections.emptyList()));

        mockMvc.perform(get("/api/events/user/attending"))
                .andExpect(status().isOk());
    }
}