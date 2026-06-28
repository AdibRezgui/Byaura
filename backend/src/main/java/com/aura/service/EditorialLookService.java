package com.aura.service;

import com.aura.model.EditorialLook;
import com.aura.model.EditorialLookItem;
import com.aura.model.EditorialLookPhoto;
import com.aura.repository.EditorialLookItemRepository;
import com.aura.repository.EditorialLookPhotoRepository;
import com.aura.repository.EditorialLookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Service
public class EditorialLookService {

    @Autowired private EditorialLookRepository lookRepo;
    @Autowired private EditorialLookPhotoRepository photoRepo;
    @Autowired private EditorialLookItemRepository itemRepo;

    @Value("${upload.dir:uploads}")
    private String uploadDir;

    public List<Map<String, Object>> listActive() {
        List<EditorialLook> looks = lookRepo.findByActiveTrueOrderByOrderIndexAsc();
        return enrich(looks);
    }

    public List<Map<String, Object>> listAll() {
        List<EditorialLook> looks = lookRepo.findAll();
        looks.sort(Comparator.comparingInt(l -> l.getOrderIndex() != null ? l.getOrderIndex() : 0));
        return enrich(looks);
    }

    public Map<String, Object> getById(Long id) {
        EditorialLook look = lookRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Look introuvable"));
        List<EditorialLookPhoto> photos = photoRepo.findByLookIdOrderByOrderIndexAsc(id);
        List<EditorialLookItem> items = itemRepo.findByLookIdOrderByOrderIndexAsc(id);
        Map<String, Object> result = new HashMap<>();
        result.put("look", look);
        result.put("photos", photos);
        result.put("items", items);
        return result;
    }

    public EditorialLook create(String name, String description, String productIds) {
        return lookRepo.save(EditorialLook.builder()
                .name(name)
                .description(description)
                .productIds(productIds)
                .build());
    }

    public EditorialLook update(Long id, String name, String description,
                                 Boolean active, Integer orderIndex, String productIds) {
        EditorialLook look = lookRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Look introuvable"));
        if (name != null)        look.setName(name);
        if (description != null) look.setDescription(description);
        if (active != null)      look.setActive(active);
        if (orderIndex != null)  look.setOrderIndex(orderIndex);
        look.setProductIds(productIds);
        return lookRepo.save(look);
    }

    public EditorialLookPhoto addPhoto(Long lookId, MultipartFile file) throws IOException {
        lookRepo.findById(lookId).orElseThrow(() -> new RuntimeException("Look introuvable"));
        String url = saveFile(file, "elook_photo_");
        List<EditorialLookPhoto> existing = photoRepo.findByLookIdOrderByOrderIndexAsc(lookId);
        return photoRepo.save(EditorialLookPhoto.builder()
                .lookId(lookId)
                .imageUrl(url)
                .orderIndex(existing.size())
                .build());
    }

    public void deletePhoto(Long photoId) {
        photoRepo.deleteById(photoId);
    }

    public EditorialLookItem addItem(Long lookId, Long productId, MultipartFile file) throws IOException {
        lookRepo.findById(lookId).orElseThrow(() -> new RuntimeException("Look introuvable"));
        String url = file != null ? saveFile(file, "elook_item_") : null;
        List<EditorialLookItem> existing = itemRepo.findByLookIdOrderByOrderIndexAsc(lookId);
        return itemRepo.save(EditorialLookItem.builder()
                .lookId(lookId)
                .productId(productId)
                .imageUrl(url)
                .orderIndex(existing.size())
                .build());
    }

    public String uploadItemImage(Long itemId, MultipartFile file) throws IOException {
        EditorialLookItem item = itemRepo.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item introuvable"));
        String url = saveFile(file, "elook_item_");
        item.setImageUrl(url);
        itemRepo.save(item);
        return url;
    }

    public void deleteItem(Long itemId) {
        itemRepo.deleteById(itemId);
    }

    public void delete(Long id) {
        photoRepo.deleteByLookId(id);
        itemRepo.deleteByLookId(id);
        lookRepo.deleteById(id);
    }

    private List<Map<String, Object>> enrich(List<EditorialLook> looks) {
        List<Map<String, Object>> result = new ArrayList<>();
        for (EditorialLook look : looks) {
            List<EditorialLookPhoto> photos = photoRepo.findByLookIdOrderByOrderIndexAsc(look.getId());
            List<EditorialLookItem> items = itemRepo.findByLookIdOrderByOrderIndexAsc(look.getId());
            Map<String, Object> dto = new HashMap<>();
            dto.put("look", look);
            dto.put("photos", photos);
            dto.put("items", items);
            result.add(dto);
        }
        return result;
    }

    private String saveFile(MultipartFile file, String prefix) throws IOException {
        Path dir = Paths.get(uploadDir);
        Files.createDirectories(dir);
        String filename = prefix + System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Files.write(dir.resolve(filename), file.getBytes());
        return "/uploads/" + filename;
    }
}
