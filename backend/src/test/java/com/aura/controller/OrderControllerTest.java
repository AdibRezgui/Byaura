package com.aura.controller;

import com.aura.model.Order;
import com.aura.security.JwtUtil;
import com.aura.service.OrderService;
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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(OrderController.class)
@AutoConfigureMockMvc(addFilters = false)
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private OrderService orderService;

    @MockBean
    private JwtUtil jwtUtil;

    @Test
    void placeOrder_returnsSuccess() throws Exception {
        Order order = Order.builder().id(5L).userId(1L).amount(100.0).build();
        when(orderService.placeOrder(any(), any(), any(), any(), any())).thenReturn(order);

        Map<String, Object> body = Map.of(
                "items", List.of(Map.of("itemId", "p1")),
                "amount", 100.0,
                "address", Map.of("city", "Tunis"),
                "paymentMethod", "COD"
        );

        mockMvc.perform(post("/api/order/place")
                        .principal(new UsernamePasswordAuthenticationToken("1", null))
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.orderId").value(5));
    }

    @Test
    void placeOrder_returnsFailureWhenMissingDetails() throws Exception {
        Map<String, Object> body = Map.of("amount", 100.0, "paymentMethod", "COD");

        mockMvc.perform(post("/api/order/place")
                        .principal(new UsernamePasswordAuthenticationToken("1", null))
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void placeOrderStripe_returnsNotImplemented() throws Exception {
        mockMvc.perform(post("/api/order/stripe"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void placeOrderRazorpay_returnsNotImplemented() throws Exception {
        mockMvc.perform(post("/api/order/razorpay"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void userOrders_returnsList() throws Exception {
        Order order = Order.builder().id(1L).userId(1L).amount(50.0).build();
        when(orderService.getUserOrders(1L)).thenReturn(List.of(order));

        mockMvc.perform(post("/api/order/userorders").principal(new UsernamePasswordAuthenticationToken("1", null)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void allOrders_returnsList() throws Exception {
        when(orderService.getAllOrders()).thenReturn(List.of());

        mockMvc.perform(post("/api/order/list"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void updateStatus_returnsSuccess() throws Exception {
        doNothing().when(orderService).updateOrderStatus(1L, "Shipped");

        Map<String, Object> body = Map.of("orderId", 1, "status", "Shipped");

        mockMvc.perform(post("/api/order/status")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
}
