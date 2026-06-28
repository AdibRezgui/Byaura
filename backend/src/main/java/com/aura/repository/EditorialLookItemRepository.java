package com.aura.repository;

import com.aura.model.EditorialLookItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface EditorialLookItemRepository extends JpaRepository<EditorialLookItem, Long> {
    List<EditorialLookItem> findByLookIdOrderByOrderIndexAsc(Long lookId);
    @Transactional
    void deleteByLookId(Long lookId);
}
