package com.aura.security;

import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "secret", "test_jwt_secret_must_be_32_chars_min");
        ReflectionTestUtils.setField(jwtUtil, "expiration", 86400000L);
    }

    @Test
    void generateUserToken_createsParsableToken() {
        String token = jwtUtil.generateUserToken(42L);

        assertThat(token).isNotBlank();
        Claims claims = jwtUtil.parseToken(token);
        assertThat(((Number) claims.get("id")).longValue()).isEqualTo(42L);
    }

    @Test
    void extractUserId_returnsCorrectId() {
        String token = jwtUtil.generateUserToken(123L);

        Long extracted = jwtUtil.extractUserId(token);

        assertThat(extracted).isEqualTo(123L);
    }

    @Test
    void generateAdminToken_containsEmailAndRole() {
        String token = jwtUtil.generateAdminToken("admin@example.com", "secret");

        Claims claims = jwtUtil.parseToken(token);
        assertThat(claims.get("email")).isEqualTo("admin@example.com");
        assertThat(claims.get("role")).isEqualTo("admin");
    }

    @Test
    void isAdminToken_trueForAdminToken() {
        String token = jwtUtil.generateAdminToken("admin@example.com", "secret");

        assertThat(jwtUtil.isAdminToken(token)).isTrue();
    }

    @Test
    void isAdminToken_falseForUserToken() {
        String token = jwtUtil.generateUserToken(1L);

        assertThat(jwtUtil.isAdminToken(token)).isFalse();
    }

    @Test
    void validateToken_trueForValidToken() {
        String token = jwtUtil.generateUserToken(1L);

        assertThat(jwtUtil.validateToken(token)).isTrue();
    }

    @Test
    void validateToken_falseForMalformedToken() {
        assertThat(jwtUtil.validateToken("not-a-valid-token")).isFalse();
    }

    @Test
    void validateToken_falseForTamperedToken() {
        String token = jwtUtil.generateUserToken(1L);
        String tampered = token.substring(0, token.length() - 2) + "xx";

        assertThat(jwtUtil.validateToken(tampered)).isFalse();
    }

    @Test
    void validateToken_falseForExpiredToken() {
        ReflectionTestUtils.setField(jwtUtil, "expiration", -1000L);
        String token = jwtUtil.generateUserToken(1L);

        assertThat(jwtUtil.validateToken(token)).isFalse();
    }
}
