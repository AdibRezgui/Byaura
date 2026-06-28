package com.aura.controller;

import com.aura.service.LookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/look")
public class LookController {

    @Autowired
    private LookService lookService;

    @Value("${upload.dir:uploads}")
    private String uploadDir;

    @GetMapping("/product/{productId}")
    public ResponseEntity<Map<String, Object>> getLooks(@PathVariable Long productId) {
        Map<String, Object> result = new HashMap<>();
        try {
            result.put("success", true);
            result.put("looks", lookService.getLooksForProduct(productId));
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public ResponseEntity<Map<String, Object>> uploadLook(
            @RequestParam("image") MultipartFile file,
            @RequestParam("productId") Long productId,
            Authentication auth) {
        Map<String, Object> result = new HashMap<>();
        try {
            Long userId = Long.parseLong(auth.getName());
            Map<String, Object> look = lookService.uploadLook(userId, productId, file, uploadDir);
            result.put("success", true);
            result.put("look", look);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{lookId}")
    public ResponseEntity<Map<String, Object>> deleteLook(
            @PathVariable Long lookId,
            Authentication auth) {
        Map<String, Object> result = new HashMap<>();
        try {
            Long userId = Long.parseLong(auth.getName());
            lookService.deleteLook(lookId, userId);
            result.put("success", true);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }
}
