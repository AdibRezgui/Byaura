package com.aura.service;

import com.aura.model.Look;
import com.aura.model.User;
import com.aura.repository.LookRepository;
import com.aura.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Service
public class LookService {

    @Autowired
    private LookRepository lookRepository;

    @Autowired
    private UserRepository userRepository;

    public Map<String, Object> uploadLook(Long userId, Long productId, MultipartFile file, String uploadDir) throws IOException {
        Path dir = Paths.get(uploadDir);
        Files.createDirectories(dir);
        String filename = "look_" + userId + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path dest = dir.resolve(filename);
        file.transferTo(dest.toFile());
        String url = "/uploads/" + filename;

        Look look = Look.builder()
                .userId(userId)
                .productId(productId)
                .imageUrl(url)
                .build();
        look = lookRepository.save(look);

        return buildDto(look, userRepository.findById(userId).orElse(null));
    }

    public List<Map<String, Object>> getLooksForProduct(Long productId) {
        List<Look> looks = lookRepository.findByProductIdOrderByCreatedAtDesc(productId);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Look look : looks) {
            User user = userRepository.findById(look.getUserId()).orElse(null);
            result.add(buildDto(look, user));
        }
        return result;
    }

    public void deleteLook(Long lookId, Long userId) throws Exception {
        Look look = lookRepository.findById(lookId)
                .orElseThrow(() -> new Exception("Look introuvable"));
        if (!look.getUserId().equals(userId)) throw new Exception("Non autorisé");
        lookRepository.delete(look);
    }

    private Map<String, Object> buildDto(Look look, User user) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("id", look.getId());
        dto.put("imageUrl", look.getImageUrl());
        dto.put("productId", look.getProductId());
        dto.put("createdAt", look.getCreatedAt());
        if (user != null) {
            dto.put("userName", user.getName());
            dto.put("userProfileImage", user.getProfileImage());
            dto.put("userId", user.getId());
        }
        return dto;
    }
}
