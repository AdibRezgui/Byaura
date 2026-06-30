package com.aura.service;

import com.aura.model.Look;
import com.aura.model.User;
import com.aura.repository.LookRepository;
import com.aura.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LookServiceTest {

    @Mock
    private LookRepository lookRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private LookService lookService;

    private User user;
    private Look look;

    @BeforeEach
    void setUp() {
        user = User.builder().id(1L).name("Alice").email("alice@test.com").profileImage("img.png").build();
        look = Look.builder().id(1L).userId(1L).productId(10L).imageUrl("/uploads/look_1.jpg")
                .createdAt(LocalDateTime.now()).build();
    }

    @Test
    void uploadLook_savesAndReturnsDto() throws Exception {
        when(lookRepository.save(any(Look.class))).thenReturn(look);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        MockMultipartFile file = new MockMultipartFile("file", "test.jpg", "image/jpeg", "data".getBytes());
        Map<String, Object> result = lookService.uploadLook(1L, 10L, file, "target/test-uploads");

        assertEquals(10L, result.get("productId"));
        assertEquals("Alice", result.get("userName"));
    }

    @Test
    void getLooksForProduct_returnsDtos() {
        when(lookRepository.findByProductIdOrderByCreatedAtDesc(10L)).thenReturn(List.of(look));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        List<Map<String, Object>> result = lookService.getLooksForProduct(10L);

        assertEquals(1, result.size());
        assertEquals("Alice", result.get(0).get("userName"));
    }

    @Test
    void getLooksForProduct_handlesMissingUser() {
        when(lookRepository.findByProductIdOrderByCreatedAtDesc(10L)).thenReturn(List.of(look));
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        List<Map<String, Object>> result = lookService.getLooksForProduct(10L);

        assertEquals(1, result.size());
        assertNull(result.get(0).get("userName"));
    }

    @Test
    void deleteLook_deletesWhenOwner() throws Exception {
        when(lookRepository.findById(1L)).thenReturn(Optional.of(look));

        lookService.deleteLook(1L, 1L);

        verify(lookRepository).delete(look);
    }

    @Test
    void deleteLook_throwsWhenNotOwner() {
        when(lookRepository.findById(1L)).thenReturn(Optional.of(look));

        assertThrows(Exception.class, () -> lookService.deleteLook(1L, 2L));
    }

    @Test
    void deleteLook_throwsWhenNotFound() {
        when(lookRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(Exception.class, () -> lookService.deleteLook(99L, 1L));
    }
}
