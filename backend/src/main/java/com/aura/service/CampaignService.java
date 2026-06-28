package com.aura.service;

import com.aura.model.Campaign;
import com.aura.model.CampaignBlock;
import com.aura.model.CampaignPhoto;
import com.aura.repository.CampaignBlockRepository;
import com.aura.repository.CampaignPhotoRepository;
import com.aura.repository.CampaignRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Service
public class CampaignService {

    @Autowired private CampaignRepository campaignRepo;
    @Autowired private CampaignPhotoRepository photoRepo;
    @Autowired private CampaignBlockRepository blockRepo;

    @Value("${upload.dir:uploads}")
    private String uploadDir;

    // ── Public ────────────────────────────────────────────────────────────────

    public List<Campaign> listActive() {
        return campaignRepo.findByActiveTrueOrderByOrderIndexAsc();
    }

    public List<Campaign> listAll() {
        return campaignRepo.findAll();
    }

    public Map<String, Object> getCampaignBySlug(String slug) {
        Campaign c = campaignRepo.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Campagne introuvable: " + slug));
        List<CampaignPhoto> photos = photoRepo.findByCampaignIdOrderByOrderIndexAsc(c.getId());
        Map<String, Object> result = new HashMap<>();
        List<CampaignBlock> blocks = blockRepo.findByCampaignIdOrderByInsertAfterPairAsc(c.getId());
        result.put("campaign", c);
        result.put("photos", photos);
        result.put("blocks", blocks);
        return result;
    }

    // ── Admin ─────────────────────────────────────────────────────────────────

    public Campaign create(String name, String slug, String headline, String subtitle, String description,
                           String col1Title, String col1Body, String col2Title, String col2Body) {
        String finalSlug = (slug != null && !slug.isBlank()) ? slug : toSlug(name);
        try {
            return campaignRepo.save(Campaign.builder()
                    .name(name).slug(finalSlug).headline(headline).subtitle(subtitle)
                    .description(description)
                    .col1Title(col1Title).col1Body(col1Body)
                    .col2Title(col2Title).col2Body(col2Body)
                    .build());
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("Le slug \"" + finalSlug + "\" existe déjà. Choisissez un slug différent.");
        }
    }

    public Campaign update(Long id, String name, String slug, String headline, String subtitle,
                           String description, Boolean active, Integer orderIndex,
                           String col1Title, String col1Body, String col2Title, String col2Body) {
        Campaign c = campaignRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Campagne introuvable"));
        if (name != null)        c.setName(name);
        if (slug != null)        c.setSlug(slug);
        if (headline != null)    c.setHeadline(headline);
        if (subtitle != null)    c.setSubtitle(subtitle);
        if (description != null) c.setDescription(description);
        if (active != null)      c.setActive(active);
        if (orderIndex != null)  c.setOrderIndex(orderIndex);
        c.setCol1Title(col1Title); c.setCol1Body(col1Body);
        c.setCol2Title(col2Title); c.setCol2Body(col2Body);
        try {
            return campaignRepo.save(c);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("Le slug \"" + c.getSlug() + "\" existe déjà. Choisissez un slug différent.");
        }
    }

    public String uploadHero(Long id, MultipartFile file) throws IOException {
        Campaign c = campaignRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Campagne introuvable"));
        String url = saveFile(file, "campaign_hero_" + id + "_");
        c.setHeroImage(url);
        campaignRepo.save(c);
        return url;
    }

    public CampaignPhoto addPhoto(Long campaignId, MultipartFile file, Long productId, String caption) throws IOException {
        String url = saveFile(file, "campaign_photo_");
        List<CampaignPhoto> existing = photoRepo.findByCampaignIdOrderByOrderIndexAsc(campaignId);
        return photoRepo.save(CampaignPhoto.builder()
                .campaignId(campaignId)
                .imageUrl(url)
                .productId(productId)
                .caption(caption)
                .orderIndex(existing.size())
                .build());
    }

    public void deletePhoto(Long photoId) {
        photoRepo.deleteById(photoId);
    }

    public CampaignBlock addBlock(Long campaignId, MultipartFile file, String leftText,
                                   String rightText, String mediaStyle, Integer insertAfterPair) throws IOException {
        String url = file != null ? saveFile(file, "campaign_block_") : null;
        return blockRepo.save(CampaignBlock.builder()
                .campaignId(campaignId)
                .mediaUrl(url)
                .leftText(leftText)
                .rightText(rightText)
                .mediaStyle(mediaStyle != null ? mediaStyle : "normal")
                .insertAfterPair(insertAfterPair != null ? insertAfterPair : 1)
                .build());
    }

    public CampaignBlock updateBlock(Long blockId, String leftText, String rightText,
                                      String mediaStyle, Integer insertAfterPair) {
        CampaignBlock b = blockRepo.findById(blockId)
                .orElseThrow(() -> new RuntimeException("Bloc introuvable"));
        if (leftText != null)       b.setLeftText(leftText);
        if (rightText != null)      b.setRightText(rightText);
        if (mediaStyle != null)     b.setMediaStyle(mediaStyle);
        if (insertAfterPair != null) b.setInsertAfterPair(insertAfterPair);
        return blockRepo.save(b);
    }

    public String uploadBlockMedia(Long blockId, MultipartFile file) throws IOException {
        CampaignBlock b = blockRepo.findById(blockId)
                .orElseThrow(() -> new RuntimeException("Bloc introuvable"));
        String url = saveFile(file, "campaign_block_");
        b.setMediaUrl(url);
        blockRepo.save(b);
        return url;
    }

    public void deleteBlock(Long blockId) {
        blockRepo.deleteById(blockId);
    }

    public List<CampaignBlock> listBlocks(Long campaignId) {
        return blockRepo.findByCampaignIdOrderByInsertAfterPairAsc(campaignId);
    }

    public void delete(Long id) {
        photoRepo.deleteByCampaignId(id);
        blockRepo.deleteByCampaignId(id);
        campaignRepo.deleteById(id);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private String saveFile(MultipartFile file, String prefix) throws IOException {
        Path dir = Paths.get(uploadDir);
        Files.createDirectories(dir);
        String filename = prefix + System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Files.write(dir.resolve(filename), file.getBytes());
        return "/uploads/" + filename;
    }

    private String toSlug(String name) {
        return name.toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
    }
}
