package com.aura.controller;

import com.aura.security.JwtUtil;
import com.aura.service.SiteConfigService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(NewsletterController.class)
@AutoConfigureMockMvc(addFilters = false)
class NewsletterControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private SiteConfigService siteConfigService;

    @MockBean
    private JwtUtil jwtUtil;

    @Test
    void subscribe_returnsSuccess() throws Exception {
        doNothing().when(siteConfigService).subscribeNewsletter("test@aura.com");

        mockMvc.perform(post("/api/newsletter/subscribe")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(Map.of("email", "test@aura.com"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void subscribe_returnsFailureWhenEmailInvalid() throws Exception {
        mockMvc.perform(post("/api/newsletter/subscribe")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(Map.of("email", "not-an-email"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Email invalide"));
    }

    @Test
    void getSubscribers_returnsList() throws Exception {
        when(siteConfigService.getNewsletterSubscribers()).thenReturn(List.of("a@test.com", "b@test.com"));

        mockMvc.perform(get("/api/newsletter/subscribers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.count").value(2));
    }
}
