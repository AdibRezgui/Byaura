package com.aura.repository;

import com.aura.model.EditorialLookPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface EditorialLookPhotoRepository extends JpaRepository<EditorialLookPhoto, Long> {
    List<EditorialLookPhoto> findByLookIdOrderByOrderIndexAsc(Long lookId);
    @Transactional
    void deleteByLookId(Long lookId);
}
