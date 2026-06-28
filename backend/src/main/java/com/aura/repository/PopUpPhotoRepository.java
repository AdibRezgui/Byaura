package com.aura.repository;

import com.aura.model.PopUpPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface PopUpPhotoRepository extends JpaRepository<PopUpPhoto, Long> {
    List<PopUpPhoto> findByPopupIdOrderByOrderIndexAsc(Long popupId);
    @Transactional
    void deleteByPopupId(Long popupId);
}
