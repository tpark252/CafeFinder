package com.cafefinder.app.web;

import com.cafefinder.app.model.Review;
import com.cafefinder.app.repo.ReviewRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/test-admin")
public class TestAdminController {

    private final ReviewRepo reviewRepo;

    public TestAdminController(ReviewRepo reviewRepo) {
        this.reviewRepo = reviewRepo;
    }

    // Simple test endpoint
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Admin controller is working!");
    }

    // Test database connection
    @GetMapping("/test-db")
    public ResponseEntity<String> testDb() {
        try {
            long count = reviewRepo.count();
            return ResponseEntity.ok("Database working! Found " + count + " reviews");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Database error: " + e.getMessage());
        }
    }

    // Get admin dashboard stats
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        try {
            long totalReviews = reviewRepo.count();
            
            // For now, use simple counts since new methods might not work yet
            List<Review> allReviews = reviewRepo.findAll();
            long pendingReviews = allReviews.stream().filter(r -> "PENDING".equals(r.getStatus())).count();
            long approvedReviews = allReviews.stream().filter(r -> "APPROVED".equals(r.getStatus())).count();
            long rejectedReviews = allReviews.stream().filter(r -> "REJECTED".equals(r.getStatus())).count();

            Map<String, Object> stats = Map.of(
                "totalReviews", totalReviews,
                "pendingReviews", pendingReviews,
                "approvedReviews", approvedReviews,
                "rejectedReviews", rejectedReviews
            );

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            System.err.println("Error in getAdminStats: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // Get all reviews by status - test version
    @GetMapping("/reviews")
    public ResponseEntity<?> getAllReviews(@RequestParam(value = "status", defaultValue = "ALL") String status) {
        try {
            System.out.println("=== Starting getAllReviews with status: " + status);
            
            // First test if repository is working
            System.out.println("Testing repository connection...");
            long count = reviewRepo.count();
            System.out.println("Total review count in database: " + count);
            
            if (count == 0) {
                System.out.println("No reviews found in database");
                return ResponseEntity.ok(List.of());
            }
            
            List<Review> reviews;
            if ("ALL".equals(status)) {
                System.out.println("Fetching all reviews...");
                reviews = reviewRepo.findAll();
            } else {
                System.out.println("Fetching reviews with status: " + status);
                reviews = reviewRepo.findByStatus(status);
            }
            
            System.out.println("Found " + reviews.size() + " reviews with status: " + status);
            
            if (reviews.isEmpty()) {
                System.out.println("No reviews found for status: " + status);
                return ResponseEntity.ok(List.of());
            }
            
            // Return the actual reviews
            System.out.println("Returning " + reviews.size() + " reviews");
            return ResponseEntity.ok(reviews);
            
        } catch (Exception e) {
            System.err.println("ERROR in getAllReviews: " + e.getClass().getName() + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "error", e.getMessage(),
                "errorType", e.getClass().getName()
            ));
        }
    }
}
