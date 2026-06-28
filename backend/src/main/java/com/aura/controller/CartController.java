package com.aura.controller;

import com.aura.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/get")
    public ResponseEntity<Map<String, Object>> getCart(Authentication auth) {
        Map<String, Object> result = new HashMap<>();
        try {
            Long userId = Long.parseLong(auth.getName());
            result.put("success", true);
            result.put("cartData", cartService.getCart(userId));
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/add")
    public ResponseEntity<Map<String, Object>> addToCart(@RequestBody Map<String, Object> body,
                                                          Authentication auth) {
        Map<String, Object> result = new HashMap<>();
        try {
            Long userId = Long.parseLong(auth.getName());
            String itemId = String.valueOf(body.get("itemId"));
            String size = (String) body.get("size");
            cartService.addToCart(userId, itemId, size);
            result.put("success", true);
            result.put("message", "Added to Cart");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/update")
    public ResponseEntity<Map<String, Object>> updateCart(@RequestBody Map<String, Object> body,
                                                           Authentication auth) {
        Map<String, Object> result = new HashMap<>();
        try {
            Long userId = Long.parseLong(auth.getName());
            String itemId = String.valueOf(body.get("itemId"));
            String size = (String) body.get("size");
            Integer quantity = ((Number) body.get("quantity")).intValue();
            cartService.updateCart(userId, itemId, size, quantity);
            result.put("success", true);
            result.put("message", "Cart Updated");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }
}
