package com.aura.repository;

import com.aura.model.Campaign;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CampaignRepository extends JpaRepository<Campaign, Long> {
    List<Campaign> findByActiveTrueOrderByOrderIndexAsc();
    Optional<Campaign> findBySlug(String slug);
}
