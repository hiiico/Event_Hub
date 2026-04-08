package com.eventhub.repository;

import com.eventhub.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@DataMongoTest
@ActiveProfiles("test")
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void cleanDb() {
        userRepository.deleteAll();
    }

    @Test
    void shouldSaveAndFindUserByEmail() {
        User user = new User();
        user.setName("Test User");
        user.setEmail("test@example.com");
        user.setPassword("encodedPassword");
        userRepository.save(user);

        User found = userRepository.findByEmail("test@example.com").orElse(null);
        assertThat(found).isNotNull();
        assertThat(found.getName()).isEqualTo("Test User");
    }

    @Test
    void shouldReturnTrueIfEmailExists() {
        User user = new User();
        user.setName("Test User");
        user.setEmail("exists@example.com");
        user.setPassword("encoded");
        userRepository.save(user);

        boolean exists = userRepository.existsByEmail("exists@example.com");
        assertThat(exists).isTrue();
    }
}