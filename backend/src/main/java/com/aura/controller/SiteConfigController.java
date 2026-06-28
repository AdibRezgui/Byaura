package com.aura.controller;

import com.aura.service.SiteConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/config")
public class SiteConfigController {

    @Autowired
    private SiteConfigService siteConfigService;

    @Value("${upload.dir:uploads}")
    private String uploadDir;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getConfig() {
        Map<String, Object> result = new HashMap<>();
        try {
            result.put("success", true);
            result.putAll(siteConfigService.getAllConfig());
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/hero")
    public ResponseEntity<Map<String, Object>> uploadHeroSlide(
            @RequestParam("file") MultipartFile file) {
        Map<String, Object> result = new HashMap<>();
        try {
            String url = siteConfigService.uploadHeroSlide(file, uploadDir);
            result.put("success", true);
            result.put("url", url);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/hero/{index}")
    public ResponseEntity<Map<String, Object>> removeHeroSlide(@PathVariable int index) {
        Map<String, Object> result = new HashMap<>();
        try {
            siteConfigService.removeHeroSlide(index, uploadDir);
            result.put("success", true);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/about")
    public ResponseEntity<Map<String, Object>> uploadAbout(
            @RequestParam("file") MultipartFile file) {
        Map<String, Object> result = new HashMap<>();
        try {
            String url = siteConfigService.uploadSingleMedia("about_image", file, uploadDir);
            result.put("success", true);
            result.put("url", url);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/contact")
    public ResponseEntity<Map<String, Object>> uploadContact(
            @RequestParam("file") MultipartFile file) {
        Map<String, Object> result = new HashMap<>();
        try {
            String url = siteConfigService.uploadSingleMedia("contact_image", file, uploadDir);
            result.put("success", true);
            result.put("url", url);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/logo")
    public ResponseEntity<Map<String, Object>> uploadLogo(
            @RequestParam("file") MultipartFile file) {
        Map<String, Object> result = new HashMap<>();
        try {
            String url = siteConfigService.uploadSingleMedia("logo", file, uploadDir);
            result.put("success", true);
            result.put("url", url);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> uploadLoginVideo(
            @RequestParam("file") MultipartFile file) {
        Map<String, Object> result = new HashMap<>();
        try {
            String url = siteConfigService.uploadSingleMedia("login_video", file, uploadDir);
            result.put("success", true);
            result.put("url", url);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/promo/text")
    public ResponseEntity<Map<String, Object>> savePromoText(@RequestBody Map<String, String> body) {
        Map<String, Object> result = new HashMap<>();
        try {
            siteConfigService.savePromoText(body.get("title"), body.get("description"));
            result.put("success", true);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/promo/image1")
    public ResponseEntity<Map<String, Object>> uploadPromoImage1(@RequestParam("file") MultipartFile file) {
        Map<String, Object> result = new HashMap<>();
        try {
            String url = siteConfigService.uploadSingleMedia("promo_image_1", file, uploadDir);
            result.put("success", true);
            result.put("url", url);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/promo/image2")
    public ResponseEntity<Map<String, Object>> uploadPromoImage2(@RequestParam("file") MultipartFile file) {
        Map<String, Object> result = new HashMap<>();
        try {
            String url = siteConfigService.uploadSingleMedia("promo_image_2", file, uploadDir);
            result.put("success", true);
            result.put("url", url);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/promo/image3")
    public ResponseEntity<Map<String, Object>> uploadPromoImage3(@RequestParam("file") MultipartFile file) {
        Map<String, Object> result = new HashMap<>();
        try {
            result.put("success", true);
            result.put("url", siteConfigService.uploadSingleMedia("promo_image_3", file, uploadDir));
        } catch (Exception e) { result.put("success", false); result.put("message", e.getMessage()); }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/promo/image4")
    public ResponseEntity<Map<String, Object>> uploadPromoImage4(@RequestParam("file") MultipartFile file) {
        Map<String, Object> result = new HashMap<>();
        try {
            result.put("success", true);
            result.put("url", siteConfigService.uploadSingleMedia("promo_image_4", file, uploadDir));
        } catch (Exception e) { result.put("success", false); result.put("message", e.getMessage()); }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/block2/text")
    public ResponseEntity<Map<String, Object>> saveBlock2Text(@RequestBody Map<String, String> body) {
        Map<String, Object> result = new HashMap<>();
        try {
            siteConfigService.saveBlock2Text(body.get("title"), body.get("description"));
            result.put("success", true);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/block2/image1")
    public ResponseEntity<Map<String, Object>> uploadBlock2Image1(@RequestParam("file") MultipartFile file) {
        Map<String, Object> result = new HashMap<>();
        try {
            String url = siteConfigService.uploadSingleMedia("block2_image_1", file, uploadDir);
            result.put("success", true);
            result.put("url", url);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/block2/image2")
    public ResponseEntity<Map<String, Object>> uploadBlock2Image2(@RequestParam("file") MultipartFile file) {
        Map<String, Object> result = new HashMap<>();
        try {
            result.put("success", true);
            result.put("url", siteConfigService.uploadSingleMedia("block2_image_2", file, uploadDir));
        } catch (Exception e) { result.put("success", false); result.put("message", e.getMessage()); }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/block2/image3")
    public ResponseEntity<Map<String, Object>> uploadBlock2Image3(@RequestParam("file") MultipartFile file) {
        Map<String, Object> result = new HashMap<>();
        try {
            result.put("success", true);
            result.put("url", siteConfigService.uploadSingleMedia("block2_image_3", file, uploadDir));
        } catch (Exception e) { result.put("success", false); result.put("message", e.getMessage()); }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/block2/image4")
    public ResponseEntity<Map<String, Object>> uploadBlock2Image4(@RequestParam("file") MultipartFile file) {
        Map<String, Object> result = new HashMap<>();
        try {
            result.put("success", true);
            result.put("url", siteConfigService.uploadSingleMedia("block2_image_4", file, uploadDir));
        } catch (Exception e) { result.put("success", false); result.put("message", e.getMessage()); }
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/media/{key}")
    public ResponseEntity<Map<String, Object>> clearMedia(@PathVariable String key) {
        Map<String, Object> result = new HashMap<>();
        try {
            Set<String> allowed = Set.of(
                "promo_image_1", "promo_image_2", "promo_image_3", "promo_image_4",
                "block2_image_1", "block2_image_2", "block2_image_3", "block2_image_4",
                "about_image", "contact_image", "logo", "login_video"
            );
            if (!allowed.contains(key)) {
                result.put("success", false);
                result.put("message", "Clé non autorisée");
                return ResponseEntity.ok(result);
            }
            siteConfigService.clearMedia(key);
            result.put("success", true);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/promo/link")
    public ResponseEntity<Map<String, Object>> savePromoLink(@RequestBody Map<String, String> body) {
        Map<String, Object> result = new HashMap<>();
        try { siteConfigService.saveBlockLink("promo", body.get("link")); result.put("success", true); }
        catch (Exception e) { result.put("success", false); result.put("message", e.getMessage()); }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/block2/link")
    public ResponseEntity<Map<String, Object>> saveBlock2Link(@RequestBody Map<String, String> body) {
        Map<String, Object> result = new HashMap<>();
        try { siteConfigService.saveBlockLink("block2", body.get("link")); result.put("success", true); }
        catch (Exception e) { result.put("success", false); result.put("message", e.getMessage()); }
        return ResponseEntity.ok(result);
    }
}
