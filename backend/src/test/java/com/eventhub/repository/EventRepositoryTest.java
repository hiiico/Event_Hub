package com.eventhub.repository;

import com.eventhub.model.Event;
import com.eventhub.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

@DataMongoTest
@ActiveProfiles("test")
public class EventRepositoryTest {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    private User organiser;

    @BeforeEach
    void setUp() {
        eventRepository.deleteAll();
        userRepository.deleteAll();

        organiser = new User();
        organiser.setName("Organiser");
        organiser.setEmail("organiser@test.com");
        organiser.setPassword("pass");
        organiser = userRepository.save(organiser);
    }

    @Test
    void shouldFindEventsByOrganiserId() {
        Event event = new Event();
        event.setTitle("Test Event");
        event.setDateTime(LocalDateTime.now().plusDays(1));
        event.setLocation("Test Location");
        event.setOrganiser(organiser);
        eventRepository.save(event);

        Page<Event> events = eventRepository.findByOrganiserId(organiser.getId(), PageRequest.of(0, 10));
        assertThat(events.getContent()).hasSize(1);
        assertThat(events.getContent().get(0).getTitle()).isEqualTo("Test Event");
    }
}