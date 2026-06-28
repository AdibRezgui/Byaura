package com.aura.repository;

import com.aura.model.Look;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LookRepository extends JpaRepository<Look, Long> {
    List<Look> findByProductIdOrderByCreatedAtDesc(Long productId);
}
