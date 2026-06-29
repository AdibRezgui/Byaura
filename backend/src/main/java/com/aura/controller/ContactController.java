package com.aura.controller;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${mail.contact.recipient:byaurardtw@gmail.com}")
    private String recipient;

    @PostMapping
    public Map<String, Object> sendContactEmail(@RequestBody Map<String, String> body) {
        String name    = body.getOrDefault("name", "").trim();
        String email   = body.getOrDefault("email", "").trim();
        String subject = body.getOrDefault("subject", "").trim();
        String message = body.getOrDefault("message", "").trim();

        if (name.isEmpty() || email.isEmpty() || subject.isEmpty() || message.isEmpty()) {
            return Map.of("success", false, "message", "Tous les champs sont requis.");
        }

        try {
            MimeMessage mime = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mime, false, "UTF-8");
            helper.setTo(recipient);
            helper.setReplyTo(email);
            helper.setSubject("[By Aura] " + subject);
            helper.setText(
                "Nom : " + name + "\n" +
                "Email : " + email + "\n\n" +
                message
            );
            mailSender.send(mime);
            return Map.of("success", true, "message", "Message envoyé avec succès.");
        } catch (Exception e) {
            return Map.of("success", false, "message", "Erreur lors de l'envoi. Réessayez plus tard.");
        }
    }
}
