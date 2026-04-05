package com.eventhub.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/")
    public String health() {
        return "Backend status is: OK";
    }

    @GetMapping("/robots933456.txt")
    public String robots() {
        return "OK";
    }
}