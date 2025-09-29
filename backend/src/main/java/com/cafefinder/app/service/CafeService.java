package com.cafefinder.app.service;

import com.cafefinder.app.model.Cafe;
import com.cafefinder.app.repo.CafeRepo;
import com.cafefinder.app.repo.ReviewRepo;
import com.cafefinder.app.model.Review;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class CafeService {
    private final CafeRepo cafeRepo;
    private final ReviewRepo reviewRepo;
    private final MongoTemplate mongoTemplate;

    public CafeService(CafeRepo cafeRepo, ReviewRepo reviewRepo, MongoTemplate mongoTemplate){
        this.cafeRepo = cafeRepo;
        this.reviewRepo = reviewRepo;
        this.mongoTemplate = mongoTemplate;
    }

    public List<Cafe> search(String q){
        if(q == null || q.isBlank()) return cafeRepo.findAll();
        return cafeRepo.findByNameContainingIgnoreCase(q);
    }

    public List<Cafe> searchWithFilters(String q, String city, Double lat, Double lng, Double radius, 
                                       Boolean wifi, Boolean seating, Boolean workFriendly, 
                                       String priceRange, Double minRating) {
        Query query = new Query();
        List<Criteria> criteria = new ArrayList<>();

        // Text search
        if (q != null && !q.isBlank()) {
            criteria.add(new Criteria().orOperator(
                Criteria.where("name").regex(q, "i"),
                Criteria.where("description").regex(q, "i"),
                Criteria.where("tags").regex(q, "i")
            ));
        }

        // Location filters
        if (city != null && !city.isBlank()) {
            criteria.add(Criteria.where("city").regex(city, "i"));
        }

        // Amenity filters
        if (wifi != null) {
            criteria.add(Criteria.where("wifi").is(wifi));
        }
        if (seating != null) {
            criteria.add(Criteria.where("seating").is(seating));
        }
        if (workFriendly != null) {
            criteria.add(Criteria.where("workFriendly").is(workFriendly));
        }

        // Price range filter
        if (priceRange != null && !priceRange.isBlank()) {
            criteria.add(Criteria.where("priceRange").is(priceRange));
        }

        // Rating filter
        if (minRating != null) {
            criteria.add(Criteria.where("avgRating").gte(minRating));
        }

        if (!criteria.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteria.toArray(new Criteria[0])));
        }

        List<Cafe> results = mongoTemplate.find(query, Cafe.class);

        // Apply radius filter if coordinates provided
        if (lat != null && lng != null && radius != null) {
            results = filterByDistance(results, lat, lng, radius);
        }

        return results;
    }

    public List<Cafe> findNearby(double lat, double lng, double radiusKm) {
        List<Cafe> allCafes = cafeRepo.findAll();
        return filterByDistance(allCafes, lat, lng, radiusKm);
    }

    private List<Cafe> filterByDistance(List<Cafe> cafes, double lat, double lng, double radiusKm) {
        return cafes.stream()
                .filter(cafe -> {
                    double distance = calculateDistance(lat, lng, cafe.getLatitude(), cafe.getLongitude());
                    return distance <= radiusKm;
                })
                .toList();
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radius of the earth in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    public List<Cafe> getPopularCafes(int limit) {
        Query query = new Query();
        query.with(Sort.by(Sort.Direction.DESC, "avgRating", "reviewsCount"));
        query.limit(limit);
        return mongoTemplate.find(query, Cafe.class);
    }

    public Cafe createCafe(Cafe cafe) {
        // Initialize ratings
        cafe.setAvgRating(0.0);
        cafe.setAvgCoffeeRating(0.0);
        cafe.setAvgTasteRating(0.0);
        cafe.setReviewsCount(0);
        cafe.setCurrentStatus("unknown");
        return cafeRepo.save(cafe);
    }

    public Cafe updateCafe(Cafe cafe) {
        return cafeRepo.save(cafe);
    }

    public double computeAvgRating(String cafeId){
        List<Review> reviews = reviewRepo.findByCafeIdOrderByCreatedAtDesc(cafeId);
        if(reviews.isEmpty()) return 0.0;
        return reviews.stream().mapToInt(Review::getOverallRating).average().orElse(0.0);
    }

    public void updateCafeRatings(String cafeId) {
        List<Review> reviews = reviewRepo.findByCafeIdOrderByCreatedAtDesc(cafeId);
        if (reviews.isEmpty()) return;

        double avgOverall = reviews.stream()
                .mapToInt(Review::getOverallRating)
                .average().orElse(0.0);

        double avgCoffee = reviews.stream()
                .filter(r -> r.getCoffeeRating() != null)
                .mapToInt(Review::getCoffeeRating)
                .average().orElse(0.0);

        double avgTaste = reviews.stream()
                .filter(r -> r.getTasteRating() != null)
                .mapToInt(Review::getTasteRating)
                .average().orElse(0.0);

        cafeRepo.findById(cafeId).ifPresent(cafe -> {
            cafe.setAvgRating(avgOverall);
            cafe.setAvgCoffeeRating(avgCoffee);
            cafe.setAvgTasteRating(avgTaste);
            cafe.setReviewsCount(reviews.size());
            cafeRepo.save(cafe);
        });
    }
}
