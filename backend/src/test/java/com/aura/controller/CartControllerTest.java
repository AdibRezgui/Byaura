package com.aura.controller;

import com.aura.security.JwtUtil;
import com.aura.service.CartService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CartController.class)
@AutoConfigureMockMvc(addFilters = false)
class CartControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CartService cartService;

    @MockBean
    private JwtUtil jwtUtil;

    private static UsernamePasswordAuthenticationToken principal() {
        return new UsernamePasswordAuthenticationToken("1", null);
    }

    @Test
    void getCart_returnsSuccess() throws Exception {
        org.mockito.Mockito.when(cartService.getCart(1L)).thenReturn(Map.of("item1", Map.of("M", 2)));

        mockMvc.perform(post("/api/cart/get").principal(principal()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void addToCart_returnsSuccess() throws Exception {
        doNothing().when(cartService).addToCart(1L, "item1", "M");

        Map<String, Object> body = Map.of("itemId", "item1", "size", "M");

        mockMvc.perform(post("/api/cart/add")
                        .principal(principal())
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Added to Cart"));
    }

    @Test
    void updateCart_returnsSuccess() throws Exception {
        doNothing().when(cartService).updateCart(1L, "item1", "M", 3);

        Map<String, Object> body = Map.of("itemId", "item1", "size", "M", "quantity", 3);

        mockMvc.perform(post("/api/cart/update")
                        .principal(principal())
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Cart Updated"));
    }
}
