package com.cafefinder.app.repo;

import com.cafefinder.app.model.ClaimRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClaimRequestRepo extends MongoRepository<ClaimRequest, String> {
    
    // Find all claim requests for a specific cafe
    List<ClaimRequest> findByCafeId(String cafeId);
    
    // Find all claim requests by a specific user
    List<ClaimRequest> findByUserId(String userId);
    
    // Find claim requests by status
    List<ClaimRequest> findByStatus(String status);
    
    // Find pending claims for a cafe
    List<ClaimRequest> findByCafeIdAndStatus(String cafeId, String status);
    
    // Check if user has already submitted a claim for this cafe
    Optional<ClaimRequest> findByCafeIdAndUserId(String cafeId, String userId);
    
    // Find all pending claims (for admin review)
    List<ClaimRequest> findByStatusOrderBySubmittedAtAsc(String status);
}
