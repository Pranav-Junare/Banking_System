package com.pranavbanksys.banking_system.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF since this is a REST API consumed by React frontend
            .csrf(csrf -> csrf.disable())

            // Since the app uses a custom session-based auth (session.getAttribute("currentUser"))
            // rather than Spring Security's built-in auth, we permit all requests at the Security
            // filter level. The individual controllers still enforce auth via session checks.
            //
            // This gives us:
            //   - BCrypt password hashing (via PasswordEncoder bean)
            //   - CSRF protection disabled for REST API
            //   - Security headers (X-Frame-Options, X-XSS-Protection, etc.)
            //   - A migration path to full Spring Security auth in the future
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()
            )

            .httpBasic(basic -> basic.disable())
            .formLogin(form -> form.disable());

        return http.build();
    }
}
