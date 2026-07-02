package com.aura.config;

import com.aura.security.JwtFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Value("${cors.allowed-origins:http://localhost:5173,http://localhost:5174}")
    private String allowedOrigins;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/api/user/register", "/api/user/login", "/api/user/admin").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/newsletter/subscribe").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/contact").permitAll()
                .requestMatchers("/actuator/health", "/actuator/prometheus").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/newsletter/subscribers").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/sale/active").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/sale/all").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/sale/*/products").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/sale/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/sale/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/sale/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/product/list").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/product/bestsellers").permitAll()
                .requestMatchers("/api/product/single").permitAll()
                .requestMatchers("/uploads/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/review/product/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/config").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/config/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/config/**").hasRole("ADMIN")
                .requestMatchers("/api/product/add", "/api/product/remove", "/api/product/sale", "/api/product/update/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/api/product/*/stock").hasRole("ADMIN")
                .requestMatchers("/api/order/list", "/api/order/status", "/api/order/archive", "/api/order/archived").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/user/list").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/user/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/look/product/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/lookbook/admin/all").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/lookbook").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/lookbook/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/lookbook/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/lookbook/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/lookbook/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/campaign/admin/all").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/campaign").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/campaign/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/campaign/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/campaign/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/campaign/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/popups/admin/all").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/popups").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/popups/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/popups/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/popups/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/popups/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
