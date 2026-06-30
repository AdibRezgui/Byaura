package com.aura.controller;

import com.aura.model.User;
import com.aura.repository.UserRepository;
import com.aura.security.JwtUtil;
import com.aura.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private JwtUtil jwtUtil;

    @Test
    void register_returnsSuccess() throws Exception {
        when(userService.register("Alice", "alice@test.com", "pass123"))
                .thenReturn(Map.of("success", true, "token", "abc"));

        Map<String, String> body = Map.of("name", "Alice", "email", "alice@test.com", "password", "pass123");

        mockMvc.perform(post("/api/user/register")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void login_returnsSuccess() throws Exception {
        when(userService.login("alice@test.com", "pass123"))
                .thenReturn(Map.of("success", true, "token", "abc"));

        Map<String, String> body = Map.of("email", "alice@test.com", "password", "pass123");

        mockMvc.perform(post("/api/user/login")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void adminLogin_returnsSuccess() throws Exception {
        when(userService.adminLogin("admin@aura.com", "admin123"))
                .thenReturn(Map.of("success", true, "token", "abc"));

        Map<String, String> body = Map.of("email", "admin@aura.com", "password", "admin123");

        mockMvc.perform(post("/api/user/admin")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void getProfile_returnsSuccess() throws Exception {
        when(userService.getProfile(1L)).thenReturn(Map.of("success", true, "name", "Alice"));

        mockMvc.perform(get("/api/user/profile").principal(new UsernamePasswordAuthenticationToken("1", null)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void updateProfile_returnsSuccess() throws Exception {
        when(userService.updateProfile(1L, "Alice2", null, null))
                .thenReturn(Map.of("success", true));

        Map<String, String> body = Map.of("name", "Alice2");

        mockMvc.perform(put("/api/user/profile")
                        .principal(new UsernamePasswordAuthenticationToken("1", null))
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void listUsers_returnsSuccess() throws Exception {
        User user = User.builder().id(1L).name("Alice").email("alice@test.com").build();
        when(userRepository.findAll()).thenReturn(List.of(user));

        mockMvc.perform(get("/api/user/list"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.users[0].name").value("Alice"));
    }

    @Test
    void deleteUser_returnsSuccess() throws Exception {
        doNothing().when(userRepository).deleteById(1L);

        mockMvc.perform(delete("/api/user/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
}
