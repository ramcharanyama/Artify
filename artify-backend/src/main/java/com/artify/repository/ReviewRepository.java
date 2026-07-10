package com.artify.repository;

import com.artify.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProductId(Long productId);
    Boolean existsByUserIdAndProductId(Long userId, Long productId);
}
