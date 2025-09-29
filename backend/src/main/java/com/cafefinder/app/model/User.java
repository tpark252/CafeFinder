package com.cafefinder.app.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Set;
import java.util.List;
import java.time.Instant;

@Document(collection="users")
public class User {
    @Id
    private String id;
    private String username;
    private String email;
    private String passwordHash;
    private Set<String> roles; // USER, OWNER, ADMIN, LOCAL_GUIDE
    
    // Profile info
    private String firstName;
    private String lastName;
    private String profilePhoto;
    private String bio;
    private String location; // City, State
    
    // Account legitimacy and social features
    private int reputation; // account legitimacy score
    private int totalReviews;
    private int helpfulVotes;
    private int followersCount;
    private int followingCount;
    private List<String> following; // User IDs
    private List<String> badges; // "local_guide", "trusted_reviewer", "coffee_expert"
    
    // Preferences
    private List<String> favoriteCafes; // Cafe IDs
    private List<String> coffeePreferences; // "espresso", "latte", etc.
    
    // Account status
    private boolean verified;
    private boolean active;
    private Instant createdAt;
    private Instant lastLogin;

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    
    public Set<String> getRoles() { return roles; }
    public void setRoles(Set<String> roles) { this.roles = roles; }
    
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    
    public String getProfilePhoto() { return profilePhoto; }
    public void setProfilePhoto(String profilePhoto) { this.profilePhoto = profilePhoto; }
    
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public int getReputation() { return reputation; }
    public void setReputation(int reputation) { this.reputation = reputation; }
    
    public int getTotalReviews() { return totalReviews; }
    public void setTotalReviews(int totalReviews) { this.totalReviews = totalReviews; }
    
    public int getHelpfulVotes() { return helpfulVotes; }
    public void setHelpfulVotes(int helpfulVotes) { this.helpfulVotes = helpfulVotes; }
    
    public int getFollowersCount() { return followersCount; }
    public void setFollowersCount(int followersCount) { this.followersCount = followersCount; }
    
    public int getFollowingCount() { return followingCount; }
    public void setFollowingCount(int followingCount) { this.followingCount = followingCount; }
    
    public List<String> getFollowing() { return following; }
    public void setFollowing(List<String> following) { this.following = following; }
    
    public List<String> getBadges() { return badges; }
    public void setBadges(List<String> badges) { this.badges = badges; }
    
    public List<String> getFavoriteCafes() { return favoriteCafes; }
    public void setFavoriteCafes(List<String> favoriteCafes) { this.favoriteCafes = favoriteCafes; }
    
    public List<String> getCoffeePreferences() { return coffeePreferences; }
    public void setCoffeePreferences(List<String> coffeePreferences) { this.coffeePreferences = coffeePreferences; }
    
    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }
    
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    
    public Instant getLastLogin() { return lastLogin; }
    public void setLastLogin(Instant lastLogin) { this.lastLogin = lastLogin; }
}
