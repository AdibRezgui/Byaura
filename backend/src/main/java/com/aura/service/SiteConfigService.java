package com.aura.service;

import com.aura.model.SiteConfig;
import com.aura.repository.SiteConfigRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Service
public class SiteConfigService {

    @Autowired
    private SiteConfigRepository repo;

    private final ObjectMapper mapper = new ObjectMapper();

    private String get(String key) {
        return repo.findById(key).map(SiteConfig::getConfigValue).orElse(null);
    }

    private void set(String key, String value) {
        repo.save(new SiteConfig(key, value));
    }

    public Map<String, Object> getAllConfig() throws Exception {
        Map<String, Object> config = new HashMap<>();
        String heroJson = get("hero_slides");
        config.put("heroSlides", heroJson != null
                ? mapper.readValue(heroJson, new TypeReference<List<Map<String, String>>>() {})
                : new ArrayList<>());
        config.put("aboutImage", get("about_image"));
        config.put("contactImage", get("contact_image"));
        config.put("logo", get("logo"));
        config.put("loginVideo", get("login_video"));
        config.put("promoTitle", get("promo_title"));
        config.put("promoDescription", get("promo_description"));
        config.put("promoImage1", get("promo_image_1"));
        config.put("promoImage2", get("promo_image_2"));
        config.put("promoImage3", get("promo_image_3"));
        config.put("promoImage4", get("promo_image_4"));
        config.put("block2Title", get("block2_title"));
        config.put("block2Description", get("block2_description"));
        config.put("block2Image1", get("block2_image_1"));
        config.put("block2Image2", get("block2_image_2"));
        config.put("block2Image3", get("block2_image_3"));
        config.put("block2Image4", get("block2_image_4"));
        config.put("promoLink", get("promo_link"));
        config.put("block2Link", get("block2_link"));
        return config;
    }

    public String uploadHeroSlide(MultipartFile file, String uploadDir) throws IOException {
        String url = saveFile(file, uploadDir);
        String type = file.getContentType() != null && file.getContentType().startsWith("video") ? "video" : "image";

        String heroJson = get("hero_slides");
        List<Map<String, String>> slides = heroJson != null
                ? mapper.readValue(heroJson, new TypeReference<>() {})
                : new ArrayList<>();
        Map<String, String> slide = new HashMap<>();
        slide.put("url", url);
        slide.put("type", type);
        slides.add(slide);
        set("hero_slides", mapper.writeValueAsString(slides));
        return url;
    }

    public void removeHeroSlide(int index, String uploadDir) throws Exception {
        String heroJson = get("hero_slides");
        if (heroJson == null) return;
        List<Map<String, String>> slides = mapper.readValue(heroJson, new TypeReference<>() {});
        if (index < 0 || index >= slides.size()) throw new Exception("Index invalide");
        slides.remove(index);
        set("hero_slides", mapper.writeValueAsString(slides));
    }

    public String uploadSingleMedia(String key, MultipartFile file, String uploadDir) throws IOException {
        String url = saveFile(file, uploadDir);
        set(key, url);
        return url;
    }

    public void savePromoText(String title, String description) {
        if (title != null) set("promo_title", title);
        if (description != null) set("promo_description", description);
    }

    public void saveBlock2Text(String title, String description) {
        if (title != null) set("block2_title", title);
        if (description != null) set("block2_description", description);
    }

    public void saveBlockLink(String prefix, String link) {
        set(prefix + "_link", link);
    }

    public void clearMedia(String key) {
        repo.deleteById(key);
    }

    public void subscribeNewsletter(String email) throws Exception {
        String json = get("newsletter_emails");
        List<String> emails = json != null
                ? mapper.readValue(json, new TypeReference<List<String>>() {})
                : new ArrayList<>();
        if (!emails.contains(email)) {
            emails.add(email);
            set("newsletter_emails", mapper.writeValueAsString(emails));
        }
    }

    public List<String> getNewsletterSubscribers() throws Exception {
        String json = get("newsletter_emails");
        return json != null
                ? mapper.readValue(json, new TypeReference<List<String>>() {})
                : new ArrayList<>();
    }

    private String saveFile(MultipartFile file, String uploadDir) throws IOException {
        Path dir = Paths.get(uploadDir);
        Files.createDirectories(dir);
        String filename = "site_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path dest = dir.resolve(filename);
        file.transferTo(dest.toFile());
        return "/uploads/" + filename;
    }
}
