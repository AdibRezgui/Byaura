package com.aura.service;

import com.aura.model.PopUp;
import com.aura.model.PopUpPhoto;
import com.aura.repository.PopUpPhotoRepository;
import com.aura.repository.PopUpRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PopUpServiceTest {

    @Mock
    private PopUpRepository repo;

    @Mock
    private PopUpPhotoRepository photoRepo;

    @InjectMocks
    private PopUpService popUpService;

    private PopUp popUp;

    @BeforeEach
    void setUp() {
        popUp = PopUp.builder().id(1L).name("Pop-up Paris").place("Paris").date("2026-01-01")
                .description("desc").active(true).orderIndex(0).build();
        ReflectionTestUtils.setField(popUpService, "uploadDir", "target/test-uploads");
    }

    @Test
    void listActive_returnsEnrichedList() {
        when(repo.findByActiveTrueOrderByOrderIndexAsc()).thenReturn(List.of(popUp));
        when(photoRepo.findByPopupIdOrderByOrderIndexAsc(1L)).thenReturn(List.of());

        List<Map<String, Object>> result = popUpService.listActive();

        assertEquals(1, result.size());
        assertEquals(popUp, result.get(0).get("popup"));
    }

    @Test
    void listAll_returnsSortedEnrichedList() {
        PopUp second = PopUp.builder().id(2L).name("Second").orderIndex(1).build();
        when(repo.findAll()).thenReturn(new java.util.ArrayList<>(List.of(second, popUp)));
        when(photoRepo.findByPopupIdOrderByOrderIndexAsc(any())).thenReturn(List.of());

        List<Map<String, Object>> result = popUpService.listAll();

        assertEquals(2, result.size());
        assertEquals(popUp, result.get(0).get("popup"));
    }

    @Test
    void create_savesPopUp() {
        when(repo.save(any(PopUp.class))).thenReturn(popUp);

        PopUp result = popUpService.create("Pop-up Paris", "Paris", "2026-01-01", "desc");

        assertEquals("Pop-up Paris", result.getName());
    }

    @Test
    void update_updatesFields() {
        when(repo.findById(1L)).thenReturn(Optional.of(popUp));
        when(repo.save(any(PopUp.class))).thenAnswer(inv -> inv.getArgument(0));

        PopUp result = popUpService.update(1L, "New Name", null, null, null, false, 5);

        assertEquals("New Name", result.getName());
        assertFalse(result.getActive());
        assertEquals(5, result.getOrderIndex());
    }

    @Test
    void update_throwsWhenNotFound() {
        when(repo.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> popUpService.update(99L, "X", null, null, null, null, null));
    }

    @Test
    void addPhoto_savesPhoto() throws Exception {
        when(repo.findById(1L)).thenReturn(Optional.of(popUp));
        when(photoRepo.findByPopupIdOrderByOrderIndexAsc(1L)).thenReturn(List.of());
        when(photoRepo.save(any(PopUpPhoto.class))).thenAnswer(inv -> inv.getArgument(0));

        MockMultipartFile file = new MockMultipartFile("file", "test.jpg", "image/jpeg", "data".getBytes());
        PopUpPhoto result = popUpService.addPhoto(1L, file);

        assertEquals(1L, result.getPopupId());
        assertTrue(result.getImageUrl().startsWith("/uploads/popup_"));
    }

    @Test
    void addPhoto_throwsWhenPopUpNotFound() {
        when(repo.findById(99L)).thenReturn(Optional.empty());

        MockMultipartFile file = new MockMultipartFile("file", "test.jpg", "image/jpeg", "data".getBytes());
        assertThrows(RuntimeException.class, () -> popUpService.addPhoto(99L, file));
    }

    @Test
    void deletePhoto_callsRepository() {
        popUpService.deletePhoto(5L);

        verify(photoRepo).deleteById(5L);
    }

    @Test
    void delete_deletesPhotosAndPopUp() {
        popUpService.delete(1L);

        verify(photoRepo).deleteByPopupId(1L);
        verify(repo).deleteById(1L);
    }
}
