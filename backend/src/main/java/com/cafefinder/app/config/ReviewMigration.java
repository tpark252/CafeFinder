package com.cafefinder.app.config;

import com.cafefinder.app.model.Review;
import com.cafefinder.app.repo.ReviewRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class ReviewMigration {
    
    @Bean
    CommandLineRunner migrateReviews(ReviewRepo reviewRepo) {
        return args -> {
            // Find all reviews that don't have a status set
            List<Review> allReviews = reviewRepo.findAll();
            boolean anyUpdated = false;
            
            for (Review review : allReviews) {
                if (review.getStatus() == null || review.getStatus().isEmpty()) {
                    // Set existing reviews as "APPROVED" to maintain current functionality
                    review.setStatus("APPROVED");
                    reviewRepo.save(review);
                    anyUpdated = true;
                }
            }
            
            if (anyUpdated) {
                System.out.println("Migrated existing reviews to have status field - set as APPROVED");
            } else {
                System.out.println("No review migration needed - all reviews have status");
            }
        };
    }
}
