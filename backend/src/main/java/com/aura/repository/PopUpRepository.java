package com.aura.repository;

import com.aura.model.PopUp;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PopUpRepository extends JpaRepository<PopUp, Long> {
    List<PopUp> findByActiveTrueOrderByOrderIndexAsc();
}
