package com.cafefinder.app.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.List;

@Document(collection="reviews")
public class Review {
    @Id
    private String id;
    private String cafeId;
    private String userId;
    private String username; // For display purposes
    
    // Ratings (1-5 scale)
    private int overallRating;
    private Integer coffeeRating;
    private Integer tasteRating;
    private Integer ambianceRating;
    private Integer serviceRating;
    private Integer valueRating;
    
    // Review content
    private String text;
    private String tasteNotes; // Specific coffee taste descriptions
    private List<String> photos;
    
    // Cafe features validation
    private Boolean wifi;
    private Boolean seating;
    private Boolean workFriendly;
    private Boolean bathrooms;
    private Boolean petFriendly;
    private String parking; // "street", "lot", "free_lot", "paid_lot", "none"
    private String priceRange; // "$", "$$", "$$$", "$$$$"
    private Integer waitTime; // minutes when visited
    
    // Review metadata
    private Instant createdAt = Instant.now();
    private Instant updatedAt;
    private int likes;
    private int helpfulVotes;
    private boolean verified; // If user actually visited (location-based)
    
    // Admin moderation
    private String status; // "PENDING", "APPROVED", "REJECTED"
    private String adminId; // Admin who reviewed it
    private String adminNotes; // Admin's notes on the review
    private Instant reviewedAt; // When admin reviewed it

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getCafeId() { return cafeId; }
    public void setCafeId(String cafeId) { this.cafeId = cafeId; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public int getOverallRating() { return overallRating; }
    public void setOverallRating(int overallRating) { this.overallRating = overallRating; }
    
    public Integer getCoffeeRating() { return coffeeRating; }
    public void setCoffeeRating(Integer coffeeRating) { this.coffeeRating = coffeeRating; }
    
    public Integer getTasteRating() { return tasteRating; }
    public void setTasteRating(Integer tasteRating) { this.tasteRating = tasteRating; }
    
    public Integer getAmbianceRating() { return ambianceRating; }
    public void setAmbianceRating(Integer ambianceRating) { this.ambianceRating = ambianceRating; }
    
    public Integer getServiceRating() { return serviceRating; }
    public void setServiceRating(Integer serviceRating) { this.serviceRating = serviceRating; }
    
    public Integer getValueRating() { return valueRating; }
    public void setValueRating(Integer valueRating) { this.valueRating = valueRating; }
    
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    
    public String getTasteNotes() { return tasteNotes; }
    public void setTasteNotes(String tasteNotes) { this.tasteNotes = tasteNotes; }
    
    public List<String> getPhotos() { return photos; }
    public void setPhotos(List<String> photos) { this.photos = photos; }
    
    public Boolean getWifi() { return wifi; }
    public void setWifi(Boolean wifi) { this.wifi = wifi; }
    
    public Boolean getSeating() { return seating; }
    public void setSeating(Boolean seating) { this.seating = seating; }
    
    public Boolean getWorkFriendly() { return workFriendly; }
    public void setWorkFriendly(Boolean workFriendly) { this.workFriendly = workFriendly; }
    
    public Boolean getBathrooms() { return bathrooms; }
    public void setBathrooms(Boolean bathrooms) { this.bathrooms = bathrooms; }
    
    public Boolean getPetFriendly() { return petFriendly; }
    public void setPetFriendly(Boolean petFriendly) { this.petFriendly = petFriendly; }
    
    public String getParking() { return parking; }
    public void setParking(String parking) { this.parking = parking; }
    
    public String getPriceRange() { return priceRange; }
    public void setPriceRange(String priceRange) { this.priceRange = priceRange; }
    
    public Integer getWaitTime() { return waitTime; }
    public void setWaitTime(Integer waitTime) { this.waitTime = waitTime; }
    
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
    
    public int getLikes() { return likes; }
    public void setLikes(int likes) { this.likes = likes; }
    
    public int getHelpfulVotes() { return helpfulVotes; }
    public void setHelpfulVotes(int helpfulVotes) { this.helpfulVotes = helpfulVotes; }
    
    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getAdminId() { return adminId; }
    public void setAdminId(String adminId) { this.adminId = adminId; }
    
    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }
    
    public Instant getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(Instant reviewedAt) { this.reviewedAt = reviewedAt; }
}
