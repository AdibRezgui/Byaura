package com.aura.repository;

import com.aura.model.CampaignPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CampaignPhotoRepository extends JpaRepository<CampaignPhoto, Long> {
    List<CampaignPhoto> findByCampaignIdOrderByOrderIndexAsc(Long campaignId);
    void deleteByCampaignId(Long campaignId);
}
