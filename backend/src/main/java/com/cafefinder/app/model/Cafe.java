package com.cafefinder.app.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.Map;

@Document(collection = "cafes")
public class Cafe {
    @Id
    private String id;
    private String name;
    private String description;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private String phone;
    private String website;
    private double latitude;
    private double longitude;
    
    // Business hours - day of week (0=Sunday) to open/close times
    private Map<Integer, String> hours; // e.g., {1: "7:00-20:00", 2: "7:00-20:00"}
    
    // Amenities and features
    private boolean wifi;
    private boolean seating;
    private boolean workFriendly;
    private boolean bathrooms;
    private boolean petFriendly;
    private boolean wheelchairAccessible;
    private String parking; // "street", "lot", "free_lot", "paid_lot", "none"
    private List<String> alternativeMilks; // "oat", "almond", "soy", "coconut"
    
    // Menu and coffee info
    private List<MenuItem> menuItems;
    private List<String> coffeeTypes; // "espresso", "drip", "cold_brew", "pour_over"
    private List<String> dietaryOptions; // "vegan", "gluten_free", "dairy_free"
    private String priceRange; // "$", "$$", "$$$", "$$$$"
    
    // Social and contact
    private List<String> socials; // Instagram, Yelp URLs
    private List<String> photos; // URLs to cafe photos
    
    // Ratings and reviews
    private double avgRating;
    private double avgCoffeeRating;
    private double avgTasteRating;
    private int reviewsCount;
    
    // Current status
    private String currentStatus; // "open", "closed", "busy"
    private Integer currentWaitTime; // minutes
    
    // Business ownership and claiming
    private String ownerId; // User ID of the verified owner
    private boolean isClaimed; // Whether this business has been claimed
    private String claimStatus; // "UNCLAIMED", "PENDING", "VERIFIED", "REJECTED"
    private java.time.Instant claimedAt;
    private String businessEmail; // Official business email for verification
    private boolean isVerified; // Whether the business has been verified by admin
    
    // Tags for search
    private List<String> tags;

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    
    public String getZipCode() { return zipCode; }
    public void setZipCode(String zipCode) { this.zipCode = zipCode; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    
    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }
    
    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }
    
    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }
    
    public Map<Integer, String> getHours() { return hours; }
    public void setHours(Map<Integer, String> hours) { this.hours = hours; }
    
    public boolean isWifi() { return wifi; }
    public void setWifi(boolean wifi) { this.wifi = wifi; }
    
    public boolean isSeating() { return seating; }
    public void setSeating(boolean seating) { this.seating = seating; }
    
    public boolean isWorkFriendly() { return workFriendly; }
    public void setWorkFriendly(boolean workFriendly) { this.workFriendly = workFriendly; }
    
    public boolean isBathrooms() { return bathrooms; }
    public void setBathrooms(boolean bathrooms) { this.bathrooms = bathrooms; }
    
    public boolean isPetFriendly() { return petFriendly; }
    public void setPetFriendly(boolean petFriendly) { this.petFriendly = petFriendly; }
    
    public boolean isWheelchairAccessible() { return wheelchairAccessible; }
    public void setWheelchairAccessible(boolean wheelchairAccessible) { this.wheelchairAccessible = wheelchairAccessible; }
    
    public String getParking() { return parking; }
    public void setParking(String parking) { this.parking = parking; }
    
    public List<String> getAlternativeMilks() { return alternativeMilks; }
    public void setAlternativeMilks(List<String> alternativeMilks) { this.alternativeMilks = alternativeMilks; }
    
    public List<MenuItem> getMenuItems() { return menuItems; }
    public void setMenuItems(List<MenuItem> menuItems) { this.menuItems = menuItems; }
    
    public List<String> getCoffeeTypes() { return coffeeTypes; }
    public void setCoffeeTypes(List<String> coffeeTypes) { this.coffeeTypes = coffeeTypes; }
    
    public List<String> getDietaryOptions() { return dietaryOptions; }
    public void setDietaryOptions(List<String> dietaryOptions) { this.dietaryOptions = dietaryOptions; }
    
    public String getPriceRange() { return priceRange; }
    public void setPriceRange(String priceRange) { this.priceRange = priceRange; }
    
    public List<String> getSocials() { return socials; }
    public void setSocials(List<String> socials) { this.socials = socials; }
    
    public List<String> getPhotos() { return photos; }
    public void setPhotos(List<String> photos) { this.photos = photos; }
    
    public double getAvgRating() { return avgRating; }
    public void setAvgRating(double avgRating) { this.avgRating = avgRating; }
    
    public double getAvgCoffeeRating() { return avgCoffeeRating; }
    public void setAvgCoffeeRating(double avgCoffeeRating) { this.avgCoffeeRating = avgCoffeeRating; }
    
    public double getAvgTasteRating() { return avgTasteRating; }
    public void setAvgTasteRating(double avgTasteRating) { this.avgTasteRating = avgTasteRating; }
    
    public int getReviewsCount() { return reviewsCount; }
    public void setReviewsCount(int reviewsCount) { this.reviewsCount = reviewsCount; }
    
    public String getCurrentStatus() { return currentStatus; }
    public void setCurrentStatus(String currentStatus) { this.currentStatus = currentStatus; }
    
    public Integer getCurrentWaitTime() { return currentWaitTime; }
    public void setCurrentWaitTime(Integer currentWaitTime) { this.currentWaitTime = currentWaitTime; }
    
    // Ownership getters and setters
    public String getOwnerId() { return ownerId; }
    public void setOwnerId(String ownerId) { this.ownerId = ownerId; }
    
    public boolean isClaimed() { return isClaimed; }
    public void setClaimed(boolean claimed) { isClaimed = claimed; }
    
    public String getClaimStatus() { return claimStatus; }
    public void setClaimStatus(String claimStatus) { this.claimStatus = claimStatus; }
    
    public java.time.Instant getClaimedAt() { return claimedAt; }
    public void setClaimedAt(java.time.Instant claimedAt) { this.claimedAt = claimedAt; }
    
    public String getBusinessEmail() { return businessEmail; }
    public void setBusinessEmail(String businessEmail) { this.businessEmail = businessEmail; }
    
    public boolean isVerified() { return isVerified; }
    public void setVerified(boolean verified) { isVerified = verified; }
    
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
}
