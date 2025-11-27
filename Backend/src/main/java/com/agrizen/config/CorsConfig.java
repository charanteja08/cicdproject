package com.agrizen.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        String[] apiOrigins = new String[] {
                "https://*.github.io",
                "http://localhost:3000",
                "http://127.0.0.1:3000",
                "http://localhost:3344",
                "http://127.0.0.1:3344",
                "http://localhost:30000",     // K8s frontend on localhost
                "http://127.0.0.1:30000"
        };

        // Main API endpoints
        registry.addMapping("/api/**")
                .allowedOriginPatterns(apiOrigins)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);

        // Uploads (open for GET/OPTIONS)
        registry.addMapping("/uploads/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "OPTIONS")
                .allowedHeaders("*")
                .maxAge(3600);

        // Legacy payment endpoint
        registry.addMapping("/payment")
                .allowedOriginPatterns(apiOrigins)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);

        // New payments endpoint under /api
        registry.addMapping("/api/payments")
                .allowedOriginPatterns(apiOrigins)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
