package com.wease.core.config;

import com.wease.core.security.jwt.JwtAuthenticationFilter;
import com.wease.user.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.http.HttpMethod;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
            .cors(cors -> {})
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                    // /error must be reachable, otherwise every unhandled exception is turned into an empty 403
                    .requestMatchers("/api/auth/**", "/error").permitAll()
                    .requestMatchers("/api/admin/**").hasAuthority(Role.ADMIN.name())
                    // Customer-only booking actions
                    .requestMatchers(HttpMethod.POST, "/api/bookings").hasAuthority(Role.CUSTOMER.name())
                    .requestMatchers(HttpMethod.GET, "/api/bookings/customer").hasAuthority(Role.CUSTOMER.name())
                    .requestMatchers(HttpMethod.PUT, "/api/bookings/*/cancel").hasAuthority(Role.CUSTOMER.name())
                    .requestMatchers(HttpMethod.PUT,
                            "/api/bookings/*/quotes/*/accept",
                            "/api/bookings/*/quotes/*/reject").hasAuthority(Role.CUSTOMER.name())
                    // Worker-only booking actions
                    .requestMatchers(HttpMethod.GET, "/api/bookings/worker").hasAuthority(Role.WORKER.name())
                    .requestMatchers(HttpMethod.PUT,
                            "/api/bookings/*/accept",
                            "/api/bookings/*/reject",
                            "/api/bookings/*/complete").hasAuthority(Role.WORKER.name())
                    .requestMatchers(HttpMethod.POST,
                            "/api/bookings/*/quotes",
                            "/api/bookings/*/payments/cash").hasAuthority(Role.WORKER.name())
                    // Worker self-service (must come before the public worker listing rules)
                    .requestMatchers(
                            "/api/workers/profile",
                            "/api/workers/availability",
                            "/api/workers/pricing",
                            "/api/workers/location",
                            "/api/workers/dashboard").hasAuthority(Role.WORKER.name())
                    // Labour firms: self-service and crew requests they receive
                    .requestMatchers("/api/firms/profile", "/api/firms/availability").hasAuthority(Role.FIRM.name())
                    .requestMatchers(HttpMethod.GET, "/api/crew-requests/firm").hasAuthority(Role.FIRM.name())
                    .requestMatchers(HttpMethod.PUT,
                            "/api/crew-requests/*/accept",
                            "/api/crew-requests/*/reject",
                            "/api/crew-requests/*/complete").hasAuthority(Role.FIRM.name())
                    // Customers requesting crews
                    .requestMatchers(HttpMethod.POST, "/api/crew-requests", "/api/bookings/*/review", "/api/crew-requests/*/review").hasAuthority(Role.CUSTOMER.name())
                    .requestMatchers(HttpMethod.GET, "/api/crew-requests/customer").hasAuthority(Role.CUSTOMER.name())
                    .requestMatchers(HttpMethod.PUT, "/api/crew-requests/*/cancel").hasAuthority(Role.CUSTOMER.name())
                    // Public marketplace browsing: anyone can view worker and firm listings and profiles
                    .requestMatchers(HttpMethod.GET, "/api/workers", "/api/workers/*", "/api/workers/*/reviews").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/firms", "/api/firms/*", "/api/firms/*/reviews").permitAll()
                    .anyRequest().authenticated())
            .exceptionHandling(ex -> ex
                    .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(
                    jwtFilter,
                    UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}
