package com.eventhub.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EventRequest {
    @NotBlank
    private String title;
    private String description;
    @NotNull
    private LocalDateTime dateTime;
    @NotBlank
    private String location;
    private String category;
    private Double latitude;
    private Double longitude;
}
