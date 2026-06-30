package com.aura.service;

import com.aura.model.SiteConfig;
import com.aura.repository.SiteConfigRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SiteConfigServiceTest {

    @Mock
    private SiteConfigRepository repo;

    @InjectMocks
    private SiteConfigService siteConfigService;

    @Test
    void getAllConfig_returnsEmptyHeroSlidesWhenNoneStored() throws Exception {
        when(repo.findById(any())).thenReturn(Optional.empty());

        Map<String, Object> result = siteConfigService.getAllConfig();

        assertThat(result.get("heroSlides")).isEqualTo(List.of());
        assertThat(result.get("logo")).isNull();
    }

    @Test
    void getAllConfig_parsesStoredHeroSlides() throws Exception {
        when(repo.findById("hero_slides"))
                .thenReturn(Optional.of(new SiteConfig("hero_slides", "[{\"url\":\"/a.jpg\",\"type\":\"image\"}]")));
        when(repo.findById(argThat(k -> !"hero_slides".equals(k)))).thenReturn(Optional.empty());

        Map<String, Object> result = siteConfigService.getAllConfig();

        @SuppressWarnings("unchecked")
        List<Map<String, String>> slides = (List<Map<String, String>>) result.get("heroSlides");
        assertThat(slides).hasSize(1);
        assertThat(slides.get(0).get("url")).isEqualTo("/a.jpg");
    }

    @Test
    void uploadHeroSlide_savesFileAndAppendsSlide() throws Exception {
        when(repo.findById("hero_slides")).thenReturn(Optional.empty());
        MockMultipartFile file = new MockMultipartFile("file", "slide.jpg", "image/jpeg", "data".getBytes());

        String url = siteConfigService.uploadHeroSlide(file, "./uploads-test");

        assertThat(url).startsWith("/uploads/site_");
        ArgumentCaptor<SiteConfig> captor = ArgumentCaptor.forClass(SiteConfig.class);
        verify(repo).save(captor.capture());
        assertThat(captor.getValue().getConfigKey()).isEqualTo("hero_slides");
        assertThat(captor.getValue().getConfigValue()).contains(url);
    }

    @Test
    void uploadHeroSlide_detectsVideoContentType() throws Exception {
        when(repo.findById("hero_slides")).thenReturn(Optional.empty());
        MockMultipartFile file = new MockMultipartFile("file", "slide.mp4", "video/mp4", "data".getBytes());

        siteConfigService.uploadHeroSlide(file, "./uploads-test");

        ArgumentCaptor<SiteConfig> captor = ArgumentCaptor.forClass(SiteConfig.class);
        verify(repo).save(captor.capture());
        assertThat(captor.getValue().getConfigValue()).contains("\"type\":\"video\"");
    }

    @Test
    void removeHeroSlide_doesNothingWhenNoSlidesStored() throws Exception {
        when(repo.findById("hero_slides")).thenReturn(Optional.empty());

        siteConfigService.removeHeroSlide(0, "./uploads-test");

        verify(repo, never()).save(any());
    }

    @Test
    void removeHeroSlide_throwsForInvalidIndex() throws Exception {
        when(repo.findById("hero_slides"))
                .thenReturn(Optional.of(new SiteConfig("hero_slides", "[{\"url\":\"/a.jpg\",\"type\":\"image\"}]")));

        assertThatThrownBy(() -> siteConfigService.removeHeroSlide(5, "./uploads-test"))
                .hasMessageContaining("Index invalide");
    }

    @Test
    void removeHeroSlide_removesAtIndex() throws Exception {
        when(repo.findById("hero_slides"))
                .thenReturn(Optional.of(new SiteConfig("hero_slides", "[{\"url\":\"/a.jpg\",\"type\":\"image\"}]")));

        siteConfigService.removeHeroSlide(0, "./uploads-test");

        ArgumentCaptor<SiteConfig> captor = ArgumentCaptor.forClass(SiteConfig.class);
        verify(repo).save(captor.capture());
        assertThat(captor.getValue().getConfigValue()).isEqualTo("[]");
    }

    @Test
    void uploadSingleMedia_savesFileAndSetsKey() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "logo.png", "image/png", "data".getBytes());

        String url = siteConfigService.uploadSingleMedia("logo", file, "./uploads-test");

        assertThat(url).startsWith("/uploads/site_");
        ArgumentCaptor<SiteConfig> captor = ArgumentCaptor.forClass(SiteConfig.class);
        verify(repo).save(captor.capture());
        assertThat(captor.getValue().getConfigKey()).isEqualTo("logo");
        assertThat(captor.getValue().getConfigValue()).isEqualTo(url);
    }

    @Test
    void savePromoText_savesBothWhenProvided() {
        siteConfigService.savePromoText("Title", "Desc");

        verify(repo).save(eq(new SiteConfig("promo_title", "Title")));
        verify(repo).save(eq(new SiteConfig("promo_description", "Desc")));
    }

    @Test
    void savePromoText_skipsNullFields() {
        siteConfigService.savePromoText(null, null);

        verify(repo, never()).save(any());
    }

    @Test
    void saveBlock2Text_savesBothWhenProvided() {
        siteConfigService.saveBlock2Text("Title", "Desc");

        verify(repo).save(eq(new SiteConfig("block2_title", "Title")));
        verify(repo).save(eq(new SiteConfig("block2_description", "Desc")));
    }

    @Test
    void saveBlockLink_savesWithSuffixedKey() {
        siteConfigService.saveBlockLink("promo", "/sale");

        verify(repo).save(eq(new SiteConfig("promo_link", "/sale")));
    }

    @Test
    void clearMedia_deletesByKey() {
        siteConfigService.clearMedia("logo");

        verify(repo).deleteById("logo");
    }

    @Test
    void subscribeNewsletter_addsNewEmail() throws Exception {
        when(repo.findById("newsletter_emails")).thenReturn(Optional.empty());

        siteConfigService.subscribeNewsletter("a@b.com");

        ArgumentCaptor<SiteConfig> captor = ArgumentCaptor.forClass(SiteConfig.class);
        verify(repo).save(captor.capture());
        assertThat(captor.getValue().getConfigValue()).contains("a@b.com");
    }

    @Test
    void subscribeNewsletter_doesNotDuplicateExistingEmail() throws Exception {
        when(repo.findById("newsletter_emails"))
                .thenReturn(Optional.of(new SiteConfig("newsletter_emails", "[\"a@b.com\"]")));

        siteConfigService.subscribeNewsletter("a@b.com");

        verify(repo, never()).save(any());
    }

    @Test
    void getNewsletterSubscribers_returnsEmptyListWhenNoneStored() throws Exception {
        when(repo.findById("newsletter_emails")).thenReturn(Optional.empty());

        List<String> result = siteConfigService.getNewsletterSubscribers();

        assertThat(result).isEmpty();
    }

    @Test
    void getNewsletterSubscribers_returnsStoredEmails() throws Exception {
        when(repo.findById("newsletter_emails"))
                .thenReturn(Optional.of(new SiteConfig("newsletter_emails", "[\"a@b.com\",\"c@d.com\"]")));

        List<String> result = siteConfigService.getNewsletterSubscribers();

        assertThat(result).containsExactly("a@b.com", "c@d.com");
    }
}
