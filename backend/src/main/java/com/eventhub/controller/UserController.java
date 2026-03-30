package com.eventhub.controller;

import com.eventhub.dto.UserDto;
import com.eventhub.dto.UserUpdateRequest;
import com.eventhub.model.User;
import com.eventhub.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/me")
    public ResponseEntity<UserDto> updateCurrentUser(@AuthenticationPrincipal UserDetails userDetails,
                                                     @Valid @RequestBody UserUpdateRequest request) {
        System.out.println("=== UPDATE USER ===");
        System.out.println("Request: name=" + request.getName() + ", email=" + request.getEmail());

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        System.out.println("Current user: id=" + user.getId() + ", name=" + user.getName() + ", email=" + user.getEmail());
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        userRepository.save(user);
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        System.out.println("Updated user: " + dto);
        return ResponseEntity.ok(dto);
    }
}