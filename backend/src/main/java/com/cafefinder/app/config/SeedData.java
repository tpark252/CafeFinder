package com.cafefinder.app.config;

import com.cafefinder.app.model.Cafe;
import com.cafefinder.app.model.MenuItem;
import com.cafefinder.app.model.User;
import com.cafefinder.app.model.Review;
import com.cafefinder.app.model.BusyEntry;
import com.cafefinder.app.repo.CafeRepo;
import com.cafefinder.app.repo.UserRepo;
import com.cafefinder.app.repo.ReviewRepo;
import com.cafefinder.app.repo.BusyRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Configuration
public class SeedData {
    @Bean
    CommandLineRunner init(CafeRepo cafes, UserRepo users, ReviewRepo reviews, BusyRepo busyRepo, PasswordEncoder encoder){
        return args -> {
            // Create sample users if none exist
            if(users.count() == 0){
                List<User> sampleUsers = SeedDataHelper.createSampleUsers(encoder);
                for (User user : sampleUsers) {
                    users.save(user);
                }
                System.out.println("Created " + sampleUsers.size() + " sample users");
            }
            
            // Create sample cafes if none exist
            if(cafes.count() == 0){
                List<Cafe> sampleCafes = SeedDataHelper.createSampleCafes();
                for (Cafe cafe : sampleCafes) {
                    cafes.save(cafe);
                }
                System.out.println("Created " + sampleCafes.size() + " sample cafes");
            } else {
                // Update existing cafes with correct hours (including Sunday)
                System.out.println("Updating hours for existing cafes to include Sunday...");
                for (Cafe cafe : cafes.findAll()) {
                    Map<Integer, String> hours = new HashMap<>();
                    for (int i = 0; i <= 6; i++) {  // 0=Sunday through 6=Saturday
                        hours.put(i, "7:00-19:00");
                    }
                    cafe.setHours(hours);
                    cafes.save(cafe);
                }
                System.out.println("Updated hours for all cafes");
            }
        };
    }
}
