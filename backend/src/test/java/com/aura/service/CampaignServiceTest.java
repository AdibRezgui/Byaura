package com.aura.service;

import com.aura.model.Campaign;
import com.aura.model.CampaignBlock;
import com.aura.model.CampaignPhoto;
import com.aura.repository.CampaignBlockRepository;
import com.aura.repository.CampaignPhotoRepository;
import com.aura.repository.CampaignRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CampaignServiceTest {

    @Mock
    private CampaignRepository campaignRepo;

    @Mock
    private CampaignPhotoRepository photoRepo;

    @Mock
    private CampaignBlockRepository blockRepo;

    @InjectMocks
    private CampaignService campaignService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(campaignService, "uploadDir", "./uploads-test");
    }

    @Test
    void listActive_delegatesToRepository() {
        Campaign c = Campaign.builder().id(1L).name("Summer").build();
        when(campaignRepo.findByActiveTrueOrderByOrderIndexAsc()).thenReturn(List.of(c));

        List<Campaign> result = campaignService.listActive();

        assertThat(result).containsExactly(c);
    }

    @Test
    void listAll_delegatesToRepository() {
        when(campaignRepo.findAll()).thenReturn(List.of());

        List<Campaign> result = campaignService.listAll();

        assertThat(result).isEmpty();
    }

    @Test
    void getCampaignBySlug_returnsCampaignPhotosAndBlocks() {
        Campaign c = Campaign.builder().id(1L).slug("summer").build();
        when(campaignRepo.findBySlug("summer")).thenReturn(Optional.of(c));
        when(photoRepo.findByCampaignIdOrderByOrderIndexAsc(1L)).thenReturn(List.of());
        when(blockRepo.findByCampaignIdOrderByInsertAfterPairAsc(1L)).thenReturn(List.of());

        Map<String, Object> result = campaignService.getCampaignBySlug("summer");

        assertThat(result.get("campaign")).isEqualTo(c);
    }

    @Test
    void getCampaignBySlug_throwsWhenNotFound() {
        when(campaignRepo.findBySlug("missing")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> campaignService.getCampaignBySlug("missing"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Campagne introuvable");
    }

    @Test
    void create_usesProvidedSlug() {
        when(campaignRepo.save(any(Campaign.class))).thenAnswer(inv -> inv.getArgument(0));

        Campaign result = campaignService.create("Summer Sale", "custom-slug", "Headline", "Sub",
                "Desc", "T1", "B1", "T2", "B2");

        assertThat(result.getSlug()).isEqualTo("custom-slug");
    }

    @Test
    void create_generatesSlugFromNameWhenBlank() {
        when(campaignRepo.save(any(Campaign.class))).thenAnswer(inv -> inv.getArgument(0));

        Campaign result = campaignService.create("Summer Sale!", "", "Headline", "Sub",
                "Desc", "T1", "B1", "T2", "B2");

        assertThat(result.getSlug()).isEqualTo("summer-sale");
    }

    @Test
    void create_throwsFriendlyMessageOnDuplicateSlug() {
        when(campaignRepo.save(any(Campaign.class))).thenThrow(new DataIntegrityViolationException("dup"));

        assertThatThrownBy(() -> campaignService.create("Summer", "dup-slug", null, null, null, null, null, null, null))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("dup-slug");
    }

    @Test
    void update_updatesProvidedFieldsOnly() {
        Campaign existing = Campaign.builder().id(1L).name("Old").slug("old").active(false).orderIndex(0).build();
        when(campaignRepo.findById(1L)).thenReturn(Optional.of(existing));
        when(campaignRepo.save(any(Campaign.class))).thenAnswer(inv -> inv.getArgument(0));

        Campaign result = campaignService.update(1L, "New Name", null, "Head", null, null,
                true, 5, "T1", "B1", "T2", "B2");

        assertThat(result.getName()).isEqualTo("New Name");
        assertThat(result.getSlug()).isEqualTo("old");
        assertThat(result.getActive()).isTrue();
        assertThat(result.getOrderIndex()).isEqualTo(5);
    }

    @Test
    void update_throwsWhenNotFound() {
        when(campaignRepo.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> campaignService.update(99L, null, null, null, null, null, null, null, null, null, null, null))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Campagne introuvable");
    }

    @Test
    void update_throwsFriendlyMessageOnDuplicateSlug() {
        Campaign existing = Campaign.builder().id(1L).slug("old").build();
        when(campaignRepo.findById(1L)).thenReturn(Optional.of(existing));
        when(campaignRepo.save(any(Campaign.class))).thenThrow(new DataIntegrityViolationException("dup"));

        assertThatThrownBy(() -> campaignService.update(1L, null, null, null, null, null, null, null, null, null, null, null))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("old");
    }

    @Test
    void uploadHero_savesFileAndUpdatesCampaign() throws IOException {
        Campaign c = Campaign.builder().id(1L).build();
        when(campaignRepo.findById(1L)).thenReturn(Optional.of(c));
        when(campaignRepo.save(any(Campaign.class))).thenAnswer(inv -> inv.getArgument(0));
        MockMultipartFile file = new MockMultipartFile("file", "hero.jpg", "image/jpeg", "data".getBytes());

        String url = campaignService.uploadHero(1L, file);

        assertThat(url).startsWith("/uploads/campaign_hero_1_");
        assertThat(c.getHeroImage()).isEqualTo(url);
    }

    @Test
    void uploadHero_throwsWhenCampaignNotFound() {
        when(campaignRepo.findById(99L)).thenReturn(Optional.empty());
        MockMultipartFile file = new MockMultipartFile("file", "hero.jpg", "image/jpeg", "data".getBytes());

        assertThatThrownBy(() -> campaignService.uploadHero(99L, file))
                .isInstanceOf(RuntimeException.class);
    }

    @Test
    void addPhoto_savesWithComputedOrderIndex() throws IOException {
        when(photoRepo.findByCampaignIdOrderByOrderIndexAsc(1L)).thenReturn(List.of(mock(CampaignPhoto.class)));
        when(photoRepo.save(any(CampaignPhoto.class))).thenAnswer(inv -> inv.getArgument(0));
        MockMultipartFile file = new MockMultipartFile("file", "photo.jpg", "image/jpeg", "data".getBytes());

        CampaignPhoto result = campaignService.addPhoto(1L, file, 2L, "caption");

        assertThat(result.getOrderIndex()).isEqualTo(1);
        assertThat(result.getCaption()).isEqualTo("caption");
    }

    @Test
    void deletePhoto_delegatesToRepository() {
        campaignService.deletePhoto(5L);

        verify(photoRepo).deleteById(5L);
    }

    @Test
    void addBlock_savesWithDefaultsWhenNullsProvided() throws IOException {
        when(blockRepo.save(any(CampaignBlock.class))).thenAnswer(inv -> inv.getArgument(0));

        CampaignBlock result = campaignService.addBlock(1L, null, "left", "right", null, null);

        assertThat(result.getMediaStyle()).isEqualTo("normal");
        assertThat(result.getInsertAfterPair()).isEqualTo(1);
        assertThat(result.getMediaUrl()).isNull();
    }

    @Test
    void addBlock_savesFileWhenProvided() throws IOException {
        when(blockRepo.save(any(CampaignBlock.class))).thenAnswer(inv -> inv.getArgument(0));
        MockMultipartFile file = new MockMultipartFile("file", "block.jpg", "image/jpeg", "data".getBytes());

        CampaignBlock result = campaignService.addBlock(1L, file, "left", "right", "polaroid", 2);

        assertThat(result.getMediaUrl()).startsWith("/uploads/campaign_block_");
        assertThat(result.getMediaStyle()).isEqualTo("polaroid");
        assertThat(result.getInsertAfterPair()).isEqualTo(2);
    }

    @Test
    void updateBlock_updatesProvidedFields() {
        CampaignBlock b = CampaignBlock.builder().id(1L).leftText("old").build();
        when(blockRepo.findById(1L)).thenReturn(Optional.of(b));
        when(blockRepo.save(any(CampaignBlock.class))).thenAnswer(inv -> inv.getArgument(0));

        CampaignBlock result = campaignService.updateBlock(1L, "new left", null, "polaroid", 3);

        assertThat(result.getLeftText()).isEqualTo("new left");
        assertThat(result.getMediaStyle()).isEqualTo("polaroid");
        assertThat(result.getInsertAfterPair()).isEqualTo(3);
    }

    @Test
    void updateBlock_throwsWhenNotFound() {
        when(blockRepo.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> campaignService.updateBlock(99L, null, null, null, null))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Bloc introuvable");
    }

    @Test
    void uploadBlockMedia_savesFileAndUpdatesBlock() throws IOException {
        CampaignBlock b = CampaignBlock.builder().id(1L).build();
        when(blockRepo.findById(1L)).thenReturn(Optional.of(b));
        when(blockRepo.save(any(CampaignBlock.class))).thenAnswer(inv -> inv.getArgument(0));
        MockMultipartFile file = new MockMultipartFile("file", "media.jpg", "image/jpeg", "data".getBytes());

        String url = campaignService.uploadBlockMedia(1L, file);

        assertThat(b.getMediaUrl()).isEqualTo(url);
    }

    @Test
    void deleteBlock_delegatesToRepository() {
        campaignService.deleteBlock(5L);

        verify(blockRepo).deleteById(5L);
    }

    @Test
    void listBlocks_delegatesToRepository() {
        when(blockRepo.findByCampaignIdOrderByInsertAfterPairAsc(1L)).thenReturn(List.of());

        List<CampaignBlock> result = campaignService.listBlocks(1L);

        assertThat(result).isEmpty();
    }

    @Test
    void delete_deletesPhotosBlocksAndCampaign() {
        campaignService.delete(1L);

        verify(photoRepo).deleteByCampaignId(1L);
        verify(blockRepo).deleteByCampaignId(1L);
        verify(campaignRepo).deleteById(1L);
    }
}
