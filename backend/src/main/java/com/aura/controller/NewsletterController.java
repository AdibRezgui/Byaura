package com.aura.controller;

import com.aura.service.SiteConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/newsletter")
public class NewsletterController {

    @Autowired
    private SiteConfigService siteConfigService;

    @PostMapping("/subscribe")
    public ResponseEntity<Map<String, Object>> subscribe(@RequestBody Map<String, String> body) {
        Map<String, Object> result = new HashMap<>();
        try {
            String email = body.get("email");
            if (email == null || !email.contains("@")) {
                result.put("success", false);
                result.put("message", "Email invalide");
                return ResponseEntity.ok(result);
            }
            siteConfigService.subscribeNewsletter(email.trim().toLowerCase());
            result.put("success", true);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/subscribers")
    public ResponseEntity<Map<String, Object>> getSubscribers() {
        Map<String, Object> result = new HashMap<>();
        try {
            List<String> emails = siteConfigService.getNewsletterSubscribers();
            result.put("success", true);
            result.put("emails", emails);
            result.put("count", emails.size());
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }
}
