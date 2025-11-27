package com.agrizen;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AgrizenBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(AgrizenBackendApplication.class, args);
        System.out.println("Agrizen Backend Application Started");
    }
} 