package com.eventhub.integration;

import com.eventhub.dto.EventRequest;
import com.eventhub.dto.RegisterRequest;
import com.eventhub.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class EventIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    private String authToken;

    @BeforeEach
    void setUp() throws Exception {
        userRepository.deleteAll();

        String uniqueEmail = "event" + System.currentTimeMillis() + "@test.com";
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setName("Event Tester");
        registerRequest.setEmail(uniqueEmail);
        registerRequest.setPassword("password");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk());

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk())
                .andReturn();

        authToken = loginResult.getResponse().getContentAsString();
    }

    @Test
    void shouldCreateAndRetrieveEvent() throws Exception {
        EventRequest eventRequest = new EventRequest();
        eventRequest.setTitle("Integration Test Event");
        eventRequest.setDescription("Test Description");
        eventRequest.setDateTime(LocalDateTime.now().plusDays(1));
        eventRequest.setLocation("Test Location");
        eventRequest.setCategory("Tech");

        MvcResult createResult = mockMvc.perform(post("/api/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + authToken)
                        .content(objectMapper.writeValueAsString(eventRequest)))
                .andExpect(status().isOk())
                .andReturn();

        String eventId = objectMapper.readTree(createResult.getResponse().getContentAsString()).get("id").asText();

        mockMvc.perform(get("/api/events/{id}", eventId))
                .andExpect(status().isOk());
    }
}