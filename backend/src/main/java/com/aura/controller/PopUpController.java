package com.aura.controller;

import com.aura.service.PopUpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/popups")
public class PopUpController {

    @Autowired private PopUpService service;

    @GetMapping
    public ResponseEntity<Map<String, Object>> listActive() {
        Map<String, Object> r = new HashMap<>();
        try { r.put("success", true); r.put("popups", service.listActive()); }
        catch (Exception e) { r.put("success", false); r.put("message", e.getMessage()); }
        return ResponseEntity.ok(r);
    }

    @GetMapping("/admin/all")
    public ResponseEntity<Map<String, Object>> listAll() {
        Map<String, Object> r = new HashMap<>();
        try { r.put("success", true); r.put("popups", service.listAll()); }
        catch (Exception e) { r.put("success", false); r.put("message", e.getMessage()); }
        return ResponseEntity.ok(r);
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> create(@RequestBody Map<String, Object> body) {
        Map<String, Object> r = new HashMap<>();
        try {
            r.put("success", true);
            r.put("popup", service.create(
                    (String) body.get("name"),
                    (String) body.get("place"),
                    (String) body.get("date"),
                    (String) body.get("description")));
        } catch (Exception e) { r.put("success", false); r.put("message", e.getMessage()); }
        return ResponseEntity.ok(r);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable Long id,
                                                       @RequestBody Map<String, Object> body) {
        Map<String, Object> r = new HashMap<>();
        try {
            Integer orderIndex = body.get("orderIndex") != null
                    ? ((Number) body.get("orderIndex")).intValue() : null;
            r.put("success", true);
            r.put("popup", service.update(id,
                    (String) body.get("name"),
                    (String) body.get("place"),
                    (String) body.get("date"),
                    (String) body.get("description"),
                    (Boolean) body.get("active"),
                    orderIndex));
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
}
