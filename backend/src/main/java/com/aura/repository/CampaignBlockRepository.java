package com.aura.repository;

import com.aura.model.CampaignBlock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface CampaignBlockRepository extends JpaRepository<CampaignBlock, Long> {
    List<CampaignBlock> findByCampaignIdOrderByInsertAfterPairAsc(Long campaignId);
    @Transactional
    void deleteByCampaignId(Long campaignId);
}
