package com.aura.controller;

import com.aura.service.EditorialLookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/lookbook")
public class EditorialLookController {

    @Autowired private EditorialLookService service;

    @GetMapping
    public ResponseEntity<Map<String, Object>> listActive() {
        Map<String, Object> r = new HashMap<>();
        try { r.put("success", true); r.put("looks", service.listActive()); }
        catch (Exception e) { r.put("success", false); r.put("message", e.getMessage()); }
        return ResponseEntity.ok(r);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable Long id) {
        Map<String, Object> r = new HashMap<>();
        try { r.put("success", true); r.putAll(service.getById(id)); }
        catch (Exception e) { r.put("success", false); r.put("message", e.getMessage()); }
        return ResponseEntity.ok(r);
    }

    @GetMapping("/admin/all")
    public ResponseEntity<Map<String, Object>> listAll() {
        Map<String, Object> r = new HashMap<>();
        try { r.put("success", true); r.put("looks", service.listAll()); }
        catch (Exception e) { r.put("success", false); r.put("message", e.getMessage()); }
        return ResponseEntity.ok(r);
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> create(@RequestBody Map<String, Object> body) {
        Map<String, Object> r = new HashMap<>();
        try {
            r.put("success", true);
            r.put("look", service.create(
                    (String) body.get("name"),
                    (String) body.get("description"),
                    (String) body.get("productIds")));
        } catch (Exception e) { r.put("success", false); r.put("message", e.getMessage()); }
        return ResponseEntity.ok(r);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable Long id,
                                                       @RequestBody Map<String, Object> body) {
        Map<String, Object> r = new HashMap<>();
        try {
            Integer orderIndex = body.get("orderIndex") != null ? ((Number) body.get("orderIndex")).intValue() : null;
            r.put("success", true);
            r.put("look", service.update(id,
                    (String) body.get("name"),
                    (String) body.get("description"),
                    (Boolean) body.get("active"),
                    orderIndex,
                    (String) body.get("productIds")));
        } catch (Exception e) { r.put("success", false); r.put("message", e.getMessage()); }
        return ResponseEntity.ok(r);
    }

    @PostMapping("/{id}/photo")
    public ResponseEntity<Map<String, Object>> addPhoto(@PathVariable Long id,
                                                         @RequestParam("file") MultipartFile file) {
        Map<String, Object> r = new HashMap<>();
        try { r.put("success", true); r.put("photo", service.addPhoto(id, file)); }
        catch (Exception e) { r.put("success", false); r.put("message", e.getMessage()); }
        return ResponseEntity.ok(r);
    }

    @DeleteMapping("/photo/{photoId}")
    public ResponseEntity<Map<String, Object>> deletePhoto(@PathVariable Long photoId) {
        Map<String, Object> r = new HashMap<>();
        try { service.deletePhoto(photoId); r.put("success", true); }
        catch (Exception e) { r.put("success", false); r.put("message", e.getMessage()); }
        return ResponseEntity.ok(r);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable Long id) {
        Map<String, Object> r = new HashMap<>();
        try { service.delete(id); r.put("success", true); }
        catch (Exception e) { r.put("success", false); r.put("message", e.getMessage()); }
        return ResponseEntity.ok(r);
    }

    // ── Items (produits avec photo éditoriale) ────────────────────────────────

    @PostMapping("/{id}/item")
    public ResponseEntity<Map<String, Object>> addItem(@PathVariable Long id,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "productId", required = false) Long productId) {
        Map<String, Object> r = new HashMap<>();
        try { r.put("success", true); r.put("item", service.addItem(id, productId, file)); }
        catch (Exception e) { r.put("success", false); r.put("message", e.getMessage()); }
        return ResponseEntity.ok(r);
    }

    @PostMapping("/item/{itemId}/image")
    public ResponseEntity<Map<String, Object>> uploadItemImage(@PathVariable Long itemId,
            @RequestParam("file") MultipartFile file) {
        Map<String, Object> r = new HashMap<>();
        try { r.put("success", true); r.put("url", service.uploadItemImage(itemId, file)); }
        catch (Exception e) { r.put("success", false); r.put("message", e.getMessage()); }
        return ResponseEntity.ok(r);
    }

    @DeleteMapping("/item/{itemId}")
    public ResponseEntity<Map<String, Object>> deleteItem(@PathVariable Long itemId) {
        Map<String, Object> r = new HashMap<>();
        try { service.deleteItem(itemId); r.put("success", true); }
        catch (Exception e) { r.put("success", false); r.put("message", e.getMessage()); }
        return ResponseEntity.ok(r);
    }
}
