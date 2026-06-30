package com.aura.controller;

import com.aura.model.Product;
import com.aura.security.JwtUtil;
import com.aura.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
@AutoConfigureMockMvc(addFilters = false)
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProductService productService;

    @MockBean
    private JwtUtil jwtUtil;

    @Test
    void listProducts_returnsSuccessTrue() throws Exception {
        Product product = Product.builder().id(1L).name("Shirt").build();
        when(productService.listProducts()).thenReturn(List.of(product));

        mockMvc.perform(get("/api/product/list"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.products[0].name").value("Shirt"));
    }

    @Test
    void singleProduct_returnsProductWhenFound() throws Exception {
        Product product = Product.builder().id(1L).name("Shirt").build();
        when(productService.findById(1L)).thenReturn(Optional.of(product));

        Map<String, Object> body = new HashMap<>();
        body.put("productId", 1);

        mockMvc.perform(post("/api/product/single")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.product.name").value("Shirt"));
    }

    @Test
    void singleProduct_returnsFailureWhenNotFound() throws Exception {
        when(productService.findById(99L)).thenReturn(Optional.empty());

        Map<String, Object> body = new HashMap<>();
        body.put("productId", 99);

        mockMvc.perform(post("/api/product/single")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Product not found"));
    }

    @Test
    void getBestSellers_returnsProductList() throws Exception {
        Product product = Product.builder().id(1L).name("Top").build();
        when(productService.getBestSellers(5)).thenReturn(List.of(product));

        mockMvc.perform(get("/api/product/bestsellers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.products[0].name").value("Top"));
    }

    @Test
    void removeProduct_returnsSuccess() throws Exception {
        Map<String, Object> body = Map.of("id", 1);

        mockMvc.perform(post("/api/product/remove")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void setSalePrice_returnsUpdatedProduct() throws Exception {
        Product product = Product.builder().id(1L).salePrice(15.0).build();
        when(productService.setSalePrice(any(Long.class), any(Double.class))).thenReturn(product);

        Map<String, Object> body = Map.of("id", 1, "salePrice", 15.0);

        mockMvc.perform(post("/api/product/sale")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Produit soldé"));
    }
}
