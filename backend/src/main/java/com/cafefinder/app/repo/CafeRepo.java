package com.cafefinder.app.repo;

import com.cafefinder.app.model.Cafe;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CafeRepo extends MongoRepository<Cafe, String> {
    List<Cafe> findByCityIgnoreCase(String city);
    List<Cafe> findByNameContainingIgnoreCase(String q);
    List<Cafe> findByWifiTrue();
    List<Cafe> findBySeatingTrue();
    List<Cafe> findByWorkFriendlyTrue();
    List<Cafe> findByPriceRange(String priceRange);
    List<Cafe> findByAvgRatingGreaterThanEqual(double rating);
}
