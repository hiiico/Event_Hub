package com.eventhub.service;

import com.eventhub.dto.AuthRequest;
import com.eventhub.dto.RegisterRequest;
import com.eventhub.repository.UserRepository;
import com.eventhub.secutity.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    @Test
    void shouldRegisterUser() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Test");
        request.setEmail("test@test.com");
        request.setPassword("password");

        when(userRepository.existsByEmail(any())).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("encoded");
        when(jwtUtil.generateToken(any())).thenReturn("token");

        String token = authService.register(request);
        assertThat(token).isEqualTo("token");
    }

    @Test
    void shouldLoginUser() {
        AuthRequest request = new AuthRequest();
        request.setEmail("test@test.com");
        request.setPassword("password");

        when(authenticationManager.authenticate(any())).thenReturn(null);
        when(jwtUtil.generateToken(any())).thenReturn("token");

        String token = authService.login(request);
        assertThat(token).isEqualTo("token");
    }
}