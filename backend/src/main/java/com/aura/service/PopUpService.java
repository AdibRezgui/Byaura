package com.aura.service;

import com.aura.model.PopUp;
import com.aura.model.PopUpPhoto;
import com.aura.repository.PopUpPhotoRepository;
import com.aura.repository.PopUpRepository;
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
public class PopUpService {

    @Autowired private PopUpRepository repo;
    @Autowired private PopUpPhotoRepository photoRepo;

    @Value("${upload.dir:uploads}")
    private String uploadDir;

    public List<Map<String, Object>> listActive() {
        return enrich(repo.findByActiveTrueOrderByOrderIndexAsc());
    }

    public List<Map<String, Object>> listAll() {
        List<PopUp> all = repo.findAll();
        all.sort(Comparator.comparingInt(p -> p.getOrderIndex() != null ? p.getOrderIndex() : 0));
        return enrich(all);
    }

    public PopUp create(String name, String place, String date, String description) {
        return repo.save(PopUp.builder()
                .name(name).place(place).date(date).description(description).build());
    }

    public PopUp update(Long id, String name, String place, String date,
                        String description, Boolean active, Integer orderIndex) {
        PopUp p = repo.findById(id).orElseThrow(() -> new RuntimeException("Pop-up introuvable"));
        if (name != null)        p.setName(name);
        if (place != null)       p.setPlace(place);
        if (date != null)        p.setDate(date);
        if (description != null) p.setDescription(description);
        if (active != null)      p.setActive(active);
        if (orderIndex != null)  p.setOrderIndex(orderIndex);
        return repo.save(p);
    }

    public PopUpPhoto addPhoto(Long popupId, MultipartFile file) throws IOException {
        repo.findById(popupId).orElseThrow(() -> new RuntimeException("Pop-up introuvable"));
        List<PopUpPhoto> existing = photoRepo.findByPopupIdOrderByOrderIndexAsc(popupId);
        String url = saveFile(file, "popup_");
        return photoRepo.save(PopUpPhoto.builder()
                .popupId(popupId).imageUrl(url).orderIndex(existing.size()).build());
    }

    public void deletePhoto(Long photoId) {
        photoRepo.deleteById(photoId);
    }

    public void delete(Long id) {
        photoRepo.deleteByPopupId(id);
        repo.deleteById(id);
    }

    private List<Map<String, Object>> enrich(List<PopUp> popups) {
        List<Map<String, Object>> result = new ArrayList<>();
        for (PopUp popup : popups) {
            List<PopUpPhoto> photos = photoRepo.findByPopupIdOrderByOrderIndexAsc(popup.getId());
            Map<String, Object> dto = new HashMap<>();
            dto.put("popup", popup);
            dto.put("photos", photos);
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
