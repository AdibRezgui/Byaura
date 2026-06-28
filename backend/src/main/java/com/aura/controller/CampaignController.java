package com.aura.controller;

import com.aura.service.CampaignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/campaign")
public class CampaignController {

    @Autowired private CampaignService campaignService;

    // ── Public ────────────────────────────────────────────────────────────────

    @GetMapping
    public ResponseEntity<Map<String, Object>> listActive() {
        Map<String, Object> r = new HashMap<>();
        try { r.put("success", true); r.put("campaigns", campaignService.listActive()); }
        catch (Exception e) { r.put("success", false); r.put("message", e.getMessage()); }
        return ResponseEntity.ok(r);
    }

    @GetMapping("/{slug}")
    public ResponseEntity<Map<String, Object>> getBySlug(@PathVariable String slug) {
        Map<String, Object> r = new HashMap<>();
        try { r.put("success", true); r.putAll(campaignService.getCampaignBySlug(slug)); }
        catch (Exception e) { r.put("success", false); r.put("message", e.getMessage()); }
        return ResponseEntity.ok(r);
    }

    // ── Admin ─────────────────────────────────────────────────────────────────

    @GetMapping("/admin/all")
    public ResponseEntity<Map<String, Object>> listAll() {
        Map<String, Object> r = new HashMap<>();
        try { r.put("success", true); r.put("campaigns", campaignService.listAll()); }
        catch (Exception e) { r.put("success", false); r.put("message", e.getMessage()); }
        return ResponseEntity.ok(r);
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> create(@RequestBody Map<String, Object> body) {
        Map<String, Object> r = new HashMap<>();
        try {
            r.put("success", true);
            r.put("campaign", campaignService.create(
                    (String) body.get("name"), (String) body.get("slug"),
                    (String) body.get("headline"), (String) body.get("subtitle"),
                    (String) body.get("description"),
                    (String) body.get("col1Title"), (String) body.get("col1Body"),
                    (String) body.get("col2Title"), (String) body.get("col2Body")));
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
            r.put("campaign", campaignService.update(id,
                    (String) body.get("name"), (String) body.get("slug"),
                    (String) body.get("headline"), (String) body.get("subtitle"),
                    (String) body.get("description"), (Boolean) body.get("active"), orderIndex,
                    (String) body.get("col1Title"), (String) body.get("col1Body"),
                    (String) body.get("col2Title"), (String) body.get("col2Body")));
        } catch (Exception e) { r.put("success", false); r.put("message", e.getMessage()); }
        return ResponseEntity.ok(r);
    }

    @PostMapping("/{id}/hero")
    public ResponseEntity<Map<String, Object>> uploadHero(@PathVariable Long id,
                                                           @RequestParam("file") MultipartFile file) {
        Map<String, Object> r = new HashMap<>();
        try { r.put("success", true); r.put("url", campaignService.uploadHero(id, file)); }
        catch (Exception e) { r.put("success", false); r.put("message", e.getMessage()); }
        return ResponseEntity.ok(r);
    }

    @PostMapping("/{id}/photo")
    public ResponseEntity<Map<String, Object>> addPhoto(@PathVariable Long id,
                                                         @RequestParam("file") MultipartFile file,
                                                         @RequestParam(value = "productId", required = false) Long productId,
                                                         @RequestParam(value = "caption", required = false) String caption) {
        Map<String, Object> r = new HashMap<>();
        try { r.put("success", true); r.put("photo", campaignService.addPhoto(id, file, productId, caption)); }
        catch (Exception e) { r.put("success", false); r.put("message", e.getMessage()); }
        return ResponseEntity.ok(r);
    }

    @DeleteMapping("/photo/{photoId}")
    public ResponseEntity<Map<String, Object>> deletePhoto(@PathVariable Long photoId) {
        Map<String, Object> r = new HashMap<>();
        try { campaignService.deletePhoto(photoId); r.put("success", true); }
        catch (Exception e) { r.put("success", false); r.put("message", e.getMessage()); }
        return ResponseEntity.ok(r);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable Long id) {
        Map<String, Object> r = new HashMap<>();
        try { campaignService.delete(id); r.put("success", true); }
        catch (Exception e) { r.put("success", false); r.put("message", e.getMessage()); }
        return ResponseEntity.ok(r);
    }

    // ── Blocks (interludes éditoriaux) ────────────────────────────────────────

    @GetMapping("/{id}/blocks")
    public ResponseEntity<Map<String, Object>> listBlocks(@PathVariable Long id) {
        Map<String, Object> r = new HashMap<>();
        try { r.put("success", true); r.put("blocks", campaignService.listBlocks(id)); }
        catch (Exception e) { r.put("success", false); r.put("message", e.getMessage()); }
        return ResponseEntity.ok(r);
    }

    @PostMapping("/{id}/block")
    public ResponseEntity<Map<String, Object>> addBlock(@PathVariable Long id,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "leftText", required = false) String leftText,
            @RequestParam(value = "rightText", required = false) String rightText,
            @RequestParam(value = "mediaStyle", required = false) String mediaStyle,
            @RequestParam(value = "insertAfterPair", required = false) Integer insertAfterPair) {
        Map<String, Object> r = new HashMap<>();
        try { r.put("success", true); r.put("block", campaignService.addBlock(id, file, leftText, rightText, mediaStyle, insertAfterPair)); }
        catch (Exception e) { r.put("success", false); r.put("message", e.getMessage()); }
        return ResponseEntity.ok(r);
    }

    @PutMapping("/block/{blockId}")
    public ResponseEntity<Map<String, Object>> updateBlock(@PathVariable Long blockId,
            @RequestBody Map<String, Object> body) {
        Map<String, Object> r = new HashMap<>();
        try {
            Integer iap = body.get("insertAfterPair") != null ? ((Number) body.get("insertAfterPair")).intValue() : null;
            r.put("success", true);
            r.put("block", campaignService.updateBlock(blockId,
                    (String) body.get("leftText"), (String) body.get("rightText"),
                    (String) body.get("mediaStyle"), iap));
        } catch (Exception e) { r.put("success", false); r.put("message", e.getMessage()); }
        return ResponseEntity.ok(r);
    }

    @PostMapping("/block/{blockId}/media")
    public ResponseEntity<Map<String, Object>> uploadBlockMedia(@PathVariable Long blockId,
            @RequestParam("file") MultipartFile file) {
        Map<String, Object> r = new HashMap<>();
        try { r.put("success", true); r.put("url", campaignService.uploadBlockMedia(blockId, file)); }
        catch (Exception e) { r.put("success", false); r.put("message", e.getMessage()); }
        return ResponseEntity.ok(r);
    }

    @DeleteMapping("/block/{blockId}")
    public ResponseEntity<Map<String, Object>> deleteBlock(@PathVariable Long blockId) {
        Map<String, Object> r = new HashMap<>();
        try { campaignService.deleteBlock(blockId); r.put("success", true); }
        catch (Exception e) { r.put("success", false); r.put("message", e.getMessage()); }
        return ResponseEntity.ok(r);
    }
}
