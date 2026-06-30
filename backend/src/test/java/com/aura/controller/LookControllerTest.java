package com.aura.controller;

import com.aura.security.JwtUtil;
import com.aura.service.LookService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(LookController.class)
@AutoConfigureMockMvc(addFilters = false)
class LookControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private LookService lookService;

    @MockBean
    private JwtUtil jwtUtil;

    @Test
    void getLooks_returnsSuccess() throws Exception {
        when(lookService.getLooksForProduct(10L)).thenReturn(List.of(Map.of("id", 1)));

        mockMvc.perform(get("/api/look/product/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void uploadLook_returnsSuccess() throws Exception {
        when(lookService.uploadLook(any(), any(), any(), any())).thenReturn(Map.of("id", 1L, "productId", 10L));

        MockMultipartFile file = new MockMultipartFile("image", "test.jpg", "image/jpeg", "data".getBytes());

        mockMvc.perform(multipart("/api/look/upload").file(file).param("productId", "10")
                        .principal(new UsernamePasswordAuthenticationToken("1", null)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void deleteLook_returnsSuccess() throws Exception {
        doNothing().when(lookService).deleteLook(1L, 1L);

        mockMvc.perform(delete("/api/look/1").principal(new UsernamePasswordAuthenticationToken("1", null)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void deleteLook_returnsFailureOnException() throws Exception {
        org.mockito.Mockito.doThrow(new RuntimeException("Non autorisé")).when(lookService).deleteLook(1L, 1L);

        mockMvc.perform(delete("/api/look/1").principal(new UsernamePasswordAuthenticationToken("1", null)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false));
    }
}
