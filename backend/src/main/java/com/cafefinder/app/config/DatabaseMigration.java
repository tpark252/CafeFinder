package com.cafefinder.app.config;

import com.cafefinder.app.model.Cafe;
import com.cafefinder.app.repo.CafeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

@Configuration
public class DatabaseMigration {
    
    @Autowired
    private MongoTemplate mongoTemplate;
    
    @Bean
    CommandLineRunner migrateCafeOwnership() {
        return args -> {
            // Check if cafes need migration (don't have claimStatus field)
            Query query = new Query(Criteria.where("claimStatus").exists(false));
            long cafesNeedingMigration = mongoTemplate.count(query, Cafe.class);
            
            if (cafesNeedingMigration > 0) {
                System.out.println("Migrating " + cafesNeedingMigration + " cafes with new ownership fields...");
                
                Update update = new Update()
                    .set("isClaimed", false)
                    .set("claimStatus", "UNCLAIMED")
                    .set("isVerified", false);
                
                mongoTemplate.updateMulti(query, update, Cafe.class);
                System.out.println("Migration completed successfully!");
            } else {
                System.out.println("No migration needed - cafes already have ownership fields.");
            }
        };
    }
}
