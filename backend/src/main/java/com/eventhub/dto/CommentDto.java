package com.eventhub.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CommentDto {
    private String id;
    private String text;
    private UserDto author;
    private LocalDateTime createdAt;
}
