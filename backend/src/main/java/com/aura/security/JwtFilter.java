package com.aura.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null) {
            authHeader = request.getHeader("token");
        }

        System.out.println("[JwtFilter] " + request.getMethod() + " " + request.getRequestURI()
                + " | token header: " + (authHeader != null ? authHeader.substring(0, Math.min(20, authHeader.length())) + "..." : "NULL"));

        if (authHeader != null) {
            String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;

            try {
                if (jwtUtil.validateToken(token)) {
                    Claims claims = jwtUtil.parseToken(token);
                    String role = (String) claims.get("role");

                    System.out.println("[JwtFilter] role=" + role);

                    String principal;
                    List<SimpleGrantedAuthority> authorities;

                    if ("admin".equals(role)) {
                        principal = "admin";
                        authorities = List.of(new SimpleGrantedAuthority("ROLE_ADMIN"));
                    } else {
                        Long userId = ((Number) claims.get("id")).longValue();
                        principal = userId.toString();
                        authorities = List.of(new SimpleGrantedAuthority("ROLE_USER"));
                    }

                    UsernamePasswordAuthenticationToken auth =
                            new UsernamePasswordAuthenticationToken(principal, null, authorities);
                    SecurityContextHolder.getContext().setAuthentication(auth);
                } else {
                    System.out.println("[JwtFilter] validateToken returned false");
                }
            } catch (Exception e) {
                System.out.println("[JwtFilter] Exception: " + e.getMessage());
            }
        }

        chain.doFilter(request, response);
    }
}
