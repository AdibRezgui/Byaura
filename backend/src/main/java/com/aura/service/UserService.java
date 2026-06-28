package com.aura.service;

import com.aura.model.User;
import com.aura.repository.UserRepository;
import com.aura.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    public Map<String, Object> register(String name, String email, String password) {
        Map<String, Object> result = new HashMap<>();

        if (userRepository.existsByEmail(email)) {
            result.put("success", false);
            result.put("message", "User already exists");
            return result;
        }

        if (!EMAIL_PATTERN.matcher(email).matches()) {
            result.put("success", false);
            result.put("message", "Invalid email");
            return result;
        }

        if (password.length() < 8) {
            result.put("success", false);
            result.put("message", "Password too short");
            return result;
        }

        User user = User.builder()
                .name(name)
                .email(email)
                .password(passwordEncoder.encode(password))
                .cartData(new HashMap<>())
                .build();

        user = userRepository.save(user);
        String token = jwtUtil.generateUserToken(user.getId());

        result.put("success", true);
        result.put("token", token);
        return result;
    }

    public Map<String, Object> login(String email, String password) {
        Map<String, Object> result = new HashMap<>();

        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            result.put("success", false);
            result.put("message", "User doesn't exist");
            return result;
        }

        User user = optionalUser.get();
        if (!passwordEncoder.matches(password, user.getPassword())) {
            result.put("success", false);
            result.put("message", "Invalid credentials");
            return result;
        }

        String token = jwtUtil.generateUserToken(user.getId());
        result.put("success", true);
        result.put("token", token);
        return result;
    }

    public Map<String, Object> adminLogin(String email, String password) {
        Map<String, Object> result = new HashMap<>();

        if (adminEmail.equals(email) && adminPassword.equals(password)) {
            String token = jwtUtil.generateAdminToken(email, password);
            result.put("success", true);
            result.put("token", token);
        } else {
            result.put("success", false);
            result.put("message", "Invalid credentials");
        }

        return result;
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void save(User user) {
        userRepository.save(user);
    }

    public Map<String, Object> getProfile(Long userId) {
        User user = findById(userId);
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("name", user.getName());
        result.put("email", user.getEmail());
        result.put("profileImage", user.getProfileImage());
        return result;
    }

    public Map<String, Object> updateProfileImage(Long userId, MultipartFile file, String uploadDir) throws IOException {
        User user = findById(userId);
        String filename = "profile_" + userId + "_" + file.getOriginalFilename();
        Path dest = Paths.get(uploadDir, filename);
        Files.createDirectories(dest.getParent());
        file.transferTo(dest.toFile());
        user.setProfileImage("/uploads/" + filename);
        userRepository.save(user);
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("imageUrl", "/uploads/" + filename);
        return result;
    }

    public Map<String, Object> updateProfile(Long userId, String newName, String currentPassword, String newPassword) {
        User user = findById(userId);
        Map<String, Object> result = new HashMap<>();
        boolean changed = false;

        if (newName != null && !newName.isBlank() && !newName.equals(user.getName())) {
            user.setName(newName.trim());
            changed = true;
        }

        if (newPassword != null && !newPassword.isBlank()) {
            if (currentPassword == null || !passwordEncoder.matches(currentPassword, user.getPassword())) {
                result.put("success", false);
                result.put("message", "Mot de passe actuel incorrect");
                return result;
            }
            if (newPassword.length() < 8) {
                result.put("success", false);
                result.put("message", "Nouveau mot de passe trop court (8 caractères min.)");
                return result;
            }
            user.setPassword(passwordEncoder.encode(newPassword));
            changed = true;
        }

        if (changed) userRepository.save(user);
        result.put("success", true);
        result.put("message", "Profil mis à jour");
        return result;
    }
}
