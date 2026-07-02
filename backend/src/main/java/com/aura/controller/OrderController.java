package com.aura.controller;

import com.aura.model.Order;
import com.aura.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/order")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/place")
    public ResponseEntity<Map<String, Object>> placeOrder(@RequestBody Map<String, Object> body,
                                                           Authentication auth) {
        Map<String, Object> result = new HashMap<>();
        try {
            Long userId = Long.parseLong(auth.getName());

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> items = (List<Map<String, Object>>) body.get("items");
            Double amount = Double.parseDouble(body.get("amount").toString());

            @SuppressWarnings("unchecked")
            Map<String, Object> address = (Map<String, Object>) body.get("address");
            String paymentMethod = (String) body.get("paymentMethod");

            if (items == null || address == null) {
                result.put("success", false);
                result.put("message", "Missing order details");
                return ResponseEntity.ok(result);
            }

            Order order = orderService.placeOrder(userId, items, amount, address, paymentMethod);
            result.put("success", true);
            result.put("message", "Order placed successfully");
            result.put("orderId", order.getId());
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/stripe")
    public ResponseEntity<Map<String, Object>> placeOrderStripe() {
        return ResponseEntity.ok(Map.of("success", false, "message", "Stripe payment not implemented yet"));
    }

    @PostMapping("/razorpay")
    public ResponseEntity<Map<String, Object>> placeOrderRazorpay() {
        return ResponseEntity.ok(Map.of("success", false, "message", "Razorpay payment not implemented yet"));
    }

    @PostMapping("/userorders")
    public ResponseEntity<Map<String, Object>> userOrders(Authentication auth) {
        Map<String, Object> result = new HashMap<>();
        try {
            Long userId = Long.parseLong(auth.getName());
            List<Order> orders = orderService.getUserOrders(userId);
            result.put("success", true);
            result.put("orders", orders);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/list")
    public ResponseEntity<Map<String, Object>> allOrders() {
        Map<String, Object> result = new HashMap<>();
        try {
            List<Order> orders = orderService.getAllOrders();
            result.put("success", true);
            result.put("orders", orders);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/archive")
    public ResponseEntity<Map<String, Object>> archiveOrder(@RequestBody Map<String, Object> body) {
        Map<String, Object> result = new HashMap<>();
        try {
            Long orderId = Long.parseLong(body.get("orderId").toString());
            orderService.archiveOrder(orderId);
            result.put("success", true);
            result.put("message", "Commande archivée");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/archived")
    public ResponseEntity<Map<String, Object>> archivedOrders() {
        Map<String, Object> result = new HashMap<>();
        try {
            result.put("success", true);
            result.put("orders", orderService.getArchivedOrders());
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/status")
    public ResponseEntity<Map<String, Object>> updateStatus(@RequestBody Map<String, Object> body) {
        Map<String, Object> result = new HashMap<>();
        try {
            Long orderId = Long.parseLong(body.get("orderId").toString());
            String status = (String) body.get("status");
            orderService.updateOrderStatus(orderId, status);
            result.put("success", true);
            result.put("message", "Order status updated");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }
}
