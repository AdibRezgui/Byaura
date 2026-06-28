package com.aura.repository;

import com.aura.model.EditorialLook;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EditorialLookRepository extends JpaRepository<EditorialLook, Long> {
    List<EditorialLook> findByActiveTrueOrderByOrderIndexAsc();
}
