package com.eventhub.repository;

import com.eventhub.model.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.LocalDateTime;

public interface EventRepository extends MongoRepository<Event, String> {
    Page<Event> findByCategory(String category, Pageable pageable);
    Page<Event> findByDateTimeBetween(LocalDateTime start, LocalDateTime end, Pageable pageable);
    Page<Event> findByOrganiserId(String organiserId, Pageable pageable);
    @Query("{ 'attendees.$id': ?0 }")
    Page<Event> findByAttendeeId(String userId, Pageable pageable);
}
