package com.aura.service;

import com.aura.model.EditorialLook;
import com.aura.model.EditorialLookItem;
import com.aura.model.EditorialLookPhoto;
import com.aura.repository.EditorialLookItemRepository;
import com.aura.repository.EditorialLookPhotoRepository;
import com.aura.repository.EditorialLookRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EditorialLookServiceTest {

    @Mock
    private EditorialLookRepository lookRepo;

    @Mock
    private EditorialLookPhotoRepository photoRepo;

    @Mock
    private EditorialLookItemRepository itemRepo;

    @InjectMocks
    private EditorialLookService editorialLookService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(editorialLookService, "uploadDir", "./uploads-test");
    }

    @Test
    void listActive_enrichesWithPhotosAndItems() {
        EditorialLook look = EditorialLook.builder().id(1L).build();
        when(lookRepo.findByActiveTrueOrderByOrderIndexAsc()).thenReturn(List.of(look));
        when(photoRepo.findByLookIdOrderByOrderIndexAsc(1L)).thenReturn(List.of());
        when(itemRepo.findByLookIdOrderByOrderIndexAsc(1L)).thenReturn(List.of());

        List<Map<String, Object>> result = editorialLookService.listActive();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).get("look")).isEqualTo(look);
    }

    @Test
    void listAll_sortsByOrderIndex() {
        EditorialLook look2 = EditorialLook.builder().id(2L).orderIndex(2).build();
        EditorialLook look1 = EditorialLook.builder().id(1L).orderIndex(1).build();
        List<EditorialLook> looks = new ArrayList<>(List.of(look2, look1));
        when(lookRepo.findAll()).thenReturn(looks);
        when(photoRepo.findByLookIdOrderByOrderIndexAsc(any())).thenReturn(List.of());
        when(itemRepo.findByLookIdOrderByOrderIndexAsc(any())).thenReturn(List.of());

        List<Map<String, Object>> result = editorialLookService.listAll();

        assertThat(((EditorialLook) result.get(0).get("look")).getId()).isEqualTo(1L);
        assertThat(((EditorialLook) result.get(1).get("look")).getId()).isEqualTo(2L);
    }

    @Test
    void getById_returnsLookPhotosAndItems() {
        EditorialLook look = EditorialLook.builder().id(1L).build();
        when(lookRepo.findById(1L)).thenReturn(Optional.of(look));
        when(photoRepo.findByLookIdOrderByOrderIndexAsc(1L)).thenReturn(List.of());
        when(itemRepo.findByLookIdOrderByOrderIndexAsc(1L)).thenReturn(List.of());

        Map<String, Object> result = editorialLookService.getById(1L);

        assertThat(result.get("look")).isEqualTo(look);
    }

    @Test
    void getById_throwsWhenNotFound() {
        when(lookRepo.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> editorialLookService.getById(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Look introuvable");
    }

    @Test
    void create_savesLook() {
        when(lookRepo.save(any(EditorialLook.class))).thenAnswer(inv -> inv.getArgument(0));

        EditorialLook result = editorialLookService.create("Look 1", "Desc", "1,2,3");

        assertThat(result.getName()).isEqualTo("Look 1");
        assertThat(result.getProductIds()).isEqualTo("1,2,3");
    }

    @Test
    void update_updatesProvidedFields() {
        EditorialLook existing = EditorialLook.builder().id(1L).name("Old").active(false).orderIndex(0).build();
        when(lookRepo.findById(1L)).thenReturn(Optional.of(existing));
        when(lookRepo.save(any(EditorialLook.class))).thenAnswer(inv -> inv.getArgument(0));

        EditorialLook result = editorialLookService.update(1L, "New", "Desc", true, 5, "1,2");

        assertThat(result.getName()).isEqualTo("New");
        assertThat(result.getActive()).isTrue();
        assertThat(result.getOrderIndex()).isEqualTo(5);
        assertThat(result.getProductIds()).isEqualTo("1,2");
    }

    @Test
    void update_throwsWhenNotFound() {
        when(lookRepo.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> editorialLookService.update(99L, null, null, null, null, null))
                .isInstanceOf(RuntimeException.class);
    }

    @Test
    void addPhoto_savesWithComputedOrderIndex() throws IOException {
        when(lookRepo.findById(1L)).thenReturn(Optional.of(EditorialLook.builder().id(1L).build()));
        when(photoRepo.findByLookIdOrderByOrderIndexAsc(1L)).thenReturn(List.of(mock(EditorialLookPhoto.class)));
        when(photoRepo.save(any(EditorialLookPhoto.class))).thenAnswer(inv -> inv.getArgument(0));
        MockMultipartFile file = new MockMultipartFile("file", "p.jpg", "image/jpeg", "data".getBytes());

        EditorialLookPhoto result = editorialLookService.addPhoto(1L, file);

        assertThat(result.getOrderIndex()).isEqualTo(1);
    }

    @Test
    void addPhoto_throwsWhenLookNotFound() {
        when(lookRepo.findById(99L)).thenReturn(Optional.empty());
        MockMultipartFile file = new MockMultipartFile("file", "p.jpg", "image/jpeg", "data".getBytes());

        assertThatThrownBy(() -> editorialLookService.addPhoto(99L, file))
                .isInstanceOf(RuntimeException.class);
    }

    @Test
    void deletePhoto_delegatesToRepository() {
        editorialLookService.deletePhoto(5L);

        verify(photoRepo).deleteById(5L);
    }

    @Test
    void addItem_savesWithoutFile() throws IOException {
        when(lookRepo.findById(1L)).thenReturn(Optional.of(EditorialLook.builder().id(1L).build()));
        when(itemRepo.findByLookIdOrderByOrderIndexAsc(1L)).thenReturn(List.of());
        when(itemRepo.save(any(EditorialLookItem.class))).thenAnswer(inv -> inv.getArgument(0));

        EditorialLookItem result = editorialLookService.addItem(1L, 2L, null);

        assertThat(result.getImageUrl()).isNull();
        assertThat(result.getProductId()).isEqualTo(2L);
    }

    @Test
    void addItem_savesWithFile() throws IOException {
        when(lookRepo.findById(1L)).thenReturn(Optional.of(EditorialLook.builder().id(1L).build()));
        when(itemRepo.findByLookIdOrderByOrderIndexAsc(1L)).thenReturn(List.of());
        when(itemRepo.save(any(EditorialLookItem.class))).thenAnswer(inv -> inv.getArgument(0));
        MockMultipartFile file = new MockMultipartFile("file", "item.jpg", "image/jpeg", "data".getBytes());

        EditorialLookItem result = editorialLookService.addItem(1L, 2L, file);

        assertThat(result.getImageUrl()).startsWith("/uploads/elook_item_");
    }

    @Test
    void uploadItemImage_updatesItem() throws IOException {
        EditorialLookItem item = EditorialLookItem.builder().id(1L).build();
        when(itemRepo.findById(1L)).thenReturn(Optional.of(item));
        when(itemRepo.save(any(EditorialLookItem.class))).thenAnswer(inv -> inv.getArgument(0));
        MockMultipartFile file = new MockMultipartFile("file", "item.jpg", "image/jpeg", "data".getBytes());

        String url = editorialLookService.uploadItemImage(1L, file);

        assertThat(item.getImageUrl()).isEqualTo(url);
    }

    @Test
    void uploadItemImage_throwsWhenNotFound() {
        when(itemRepo.findById(99L)).thenReturn(Optional.empty());
        MockMultipartFile file = new MockMultipartFile("file", "item.jpg", "image/jpeg", "data".getBytes());

        assertThatThrownBy(() -> editorialLookService.uploadItemImage(99L, file))
                .isInstanceOf(RuntimeException.class);
    }

    @Test
    void deleteItem_delegatesToRepository() {
        editorialLookService.deleteItem(5L);

        verify(itemRepo).deleteById(5L);
    }

    @Test
    void delete_deletesPhotosItemsAndLook() {
        editorialLookService.delete(1L);

        verify(photoRepo).deleteByLookId(1L);
        verify(itemRepo).deleteByLookId(1L);
        verify(lookRepo).deleteById(1L);
    }
}
