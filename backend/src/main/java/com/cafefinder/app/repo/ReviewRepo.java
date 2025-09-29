package com.cafefinder.app.repo;

import com.cafefinder.app.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ReviewRepo extends MongoRepository<Review, String> {
    List<Review> findByCafeIdOrderByCreatedAtDesc(String cafeId);
    List<Review> findByUserIdOrderByCreatedAtDesc(String userId);
    List<Review> findTop10ByOrderByCreatedAtDesc();
    List<Review> findByCafeIdAndOverallRatingGreaterThanEqual(String cafeId, int rating);
    
    // Admin moderation queries
    List<Review> findByStatus(String status);
    List<Review> findByStatusOrderByCreatedAtDesc(String status);
    long countByStatus(String status);
    List<Review> findByAdminId(String adminId);
    
    // Public queries (approved reviews only)
    List<Review> findByCafeIdAndStatusOrderByCreatedAtDesc(String cafeId, String status);
    List<Review> findByUserIdAndStatusOrderByCreatedAtDesc(String userId, String status);
    List<Review> findTop10ByStatusOrderByCreatedAtDesc(String status);
}
