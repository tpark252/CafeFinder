package com.cafefinder.app.web;

import com.cafefinder.app.model.Review;
import com.cafefinder.app.repo.ReviewRepo;
import com.cafefinder.app.service.UserDetailsImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final ReviewRepo reviewRepo;

    public AdminController(ReviewRepo reviewRepo) {
        this.reviewRepo = reviewRepo;
    }

    // Get all pending reviews for admin approval
    @GetMapping("/reviews/pending")
    // @PreAuthorize("hasRole('ADMIN')") // Temporarily disabled for testing
    public ResponseEntity<List<Review>> getPendingReviews() {
        List<Review> pendingReviews = reviewRepo.findByStatus("PENDING");
        return ResponseEntity.ok(pendingReviews);
    }

    // Get all reviews (pending, approved, rejected) for admin dashboard
    @GetMapping("/reviews")
    // @PreAuthorize("hasRole('ADMIN')") // Temporarily disabled for testing
    public ResponseEntity<List<Review>> getAllReviews(@RequestParam(value = "status", defaultValue = "ALL") String status) {
        List<Review> reviews;
        if ("ALL".equals(status)) {
            reviews = reviewRepo.findAll();
        } else {
            reviews = reviewRepo.findByStatus(status);
        }
        return ResponseEntity.ok(reviews);
    }

    // Approve or reject a review
    @PostMapping("/reviews/{reviewId}/review")
    // @PreAuthorize("hasRole('ADMIN')") // Temporarily disabled for testing
    public ResponseEntity<?> reviewReview(
            @PathVariable("reviewId") String reviewId,
            @Valid @RequestBody ReviewModerationRequest request,
            Authentication authentication) {
        try {
            // Temporarily use a default admin ID since auth is disabled
            String adminId = "admin-temp-id";
            if (authentication != null && authentication.getPrincipal() instanceof UserDetailsImpl) {
                UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
                adminId = userDetails.getId();
            }

            Optional<Review> reviewOpt = reviewRepo.findById(reviewId);
            if (!reviewOpt.isPresent()) {
                return ResponseEntity.badRequest().body("Review not found");
            }

            Review review = reviewOpt.get();
            
            // Update review status
            review.setStatus(request.getStatus());
            review.setAdminId(adminId);
            review.setAdminNotes(request.getAdminNotes());
            review.setReviewedAt(Instant.now());

            reviewRepo.save(review);

            return ResponseEntity.ok().body(Map.of(
                "message", "Review " + request.getStatus().toLowerCase() + " successfully",
                "reviewId", reviewId,
                "status", request.getStatus()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error processing review: " + e.getMessage());
        }
    }

    // Get admin dashboard stats
    @GetMapping("/stats")
    // @PreAuthorize("hasRole('ADMIN')") // Temporarily disabled for testing
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        long totalReviews = reviewRepo.count();
        long pendingReviews = reviewRepo.countByStatus("PENDING");
        long approvedReviews = reviewRepo.countByStatus("APPROVED");
        long rejectedReviews = reviewRepo.countByStatus("REJECTED");

        Map<String, Object> stats = Map.of(
            "totalReviews", totalReviews,
            "pendingReviews", pendingReviews,
            "approvedReviews", approvedReviews,
            "rejectedReviews", rejectedReviews
        );

        return ResponseEntity.ok(stats);
    }

    // DTO for review moderation
    public static class ReviewModerationRequest {
        private String status; // "APPROVED" or "REJECTED"
        private String adminNotes;

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        
        public String getAdminNotes() { return adminNotes; }
        public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }
    }
}
