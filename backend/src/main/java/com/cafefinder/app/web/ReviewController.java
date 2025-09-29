package com.cafefinder.app.web;

import com.cafefinder.app.model.Review;
import com.cafefinder.app.repo.ReviewRepo;
import com.cafefinder.app.service.CafeService;
import com.cafefinder.app.service.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    private final ReviewRepo repo;
    
    @Autowired
    private CafeService cafeService;

    public ReviewController(ReviewRepo repo){
        this.repo = repo;
    }

    @GetMapping("/public/cafe/{cafeId}")
    public List<Review> getReviewsByCafe(@PathVariable("cafeId") String cafeId) {
        return repo.findByCafeIdAndStatusOrderByCreatedAtDesc(cafeId, "APPROVED");
    }

    @GetMapping("/public/user/{userId}")
    public List<Review> getReviewsByUser(@PathVariable("userId") String userId) {
        return repo.findByUserIdAndStatusOrderByCreatedAtDesc(userId, "APPROVED");
    }

    @GetMapping("/public/recent")
    public List<Review> getRecentReviews(@RequestParam(value = "limit", defaultValue = "10") int limit) {
        return repo.findTop10ByStatusOrderByCreatedAtDesc("APPROVED");
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Review> createReview(@RequestBody Review review, Authentication auth) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        
        review.setUserId(userDetails.getId());
        review.setUsername(userDetails.getUsername());
        review.setCreatedAt(Instant.now());
        review.setUpdatedAt(Instant.now());
        review.setLikes(0);
        review.setHelpfulVotes(0);
        review.setStatus("PENDING"); // New reviews need admin approval
        
        Review savedReview = repo.save(review);
        
        // Update cafe ratings
        cafeService.updateCafeRatings(review.getCafeId());
        
        return ResponseEntity.ok(savedReview);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Review> updateReview(@PathVariable("id") String id, @RequestBody Review review, Authentication auth) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        
        return repo.findById(id)
                .filter(existingReview -> existingReview.getUserId().equals(userDetails.getId()))
                .map(existingReview -> {
                    review.setId(id);
                    review.setUserId(userDetails.getId());
                    review.setUsername(userDetails.getUsername());
                    review.setCreatedAt(existingReview.getCreatedAt());
                    review.setUpdatedAt(Instant.now());
                    Review updated = repo.save(review);
                    cafeService.updateCafeRatings(review.getCafeId());
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteReview(@PathVariable("id") String id, Authentication auth) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        
        return repo.findById(id)
                .map(review -> {
                    boolean isOwner = review.getUserId().equals(userDetails.getId());
                    boolean isAdmin = userDetails.getAuthorities().stream()
                            .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
                    
                    if (isOwner || isAdmin) {
                        String cafeId = review.getCafeId();
                        repo.delete(review);
                        cafeService.updateCafeRatings(cafeId);
                        return ResponseEntity.ok().build();
                    } else {
                        return ResponseEntity.status(403).build();
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/like")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Review> likeReview(@PathVariable("id") String id) {
        return repo.findById(id)
                .map(review -> {
                    review.setLikes(review.getLikes() + 1);
                    return ResponseEntity.ok(repo.save(review));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/helpful")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Review> markHelpful(@PathVariable("id") String id) {
        return repo.findById(id)
                .map(review -> {
                    review.setHelpfulVotes(review.getHelpfulVotes() + 1);
                    return ResponseEntity.ok(repo.save(review));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Legacy endpoint for backward compatibility
    @GetMapping("/by-cafe/{cafeId}")
    public List<Review> byCafe(@PathVariable("cafeId") String cafeId){
        return repo.findByCafeIdOrderByCreatedAtDesc(cafeId);
    }
}
