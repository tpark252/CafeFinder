package com.cafefinder.app.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Document(collection = "claim_requests")
public class ClaimRequest {
    @Id
    private String id;
    private String cafeId;
    private String userId;
    private String businessEmail;
    private String businessPhone;
    private String ownerName;
    private String ownerTitle; // e.g., "Owner", "Manager", "Marketing Director"
    private String verificationDocument; // URL/path to uploaded document
    private String reason; // Why they should be able to claim this business
    private String status; // "PENDING", "APPROVED", "REJECTED"
    private Instant submittedAt;
    private Instant reviewedAt;
    private String reviewedBy; // Admin user ID who reviewed the claim
    private String reviewNotes; // Admin notes about the decision
    
    // Default constructor
    public ClaimRequest() {
        this.submittedAt = Instant.now();
        this.status = "PENDING";
    }
    
    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getCafeId() { return cafeId; }
    public void setCafeId(String cafeId) { this.cafeId = cafeId; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public String getBusinessEmail() { return businessEmail; }
    public void setBusinessEmail(String businessEmail) { this.businessEmail = businessEmail; }
    
    public String getBusinessPhone() { return businessPhone; }
    public void setBusinessPhone(String businessPhone) { this.businessPhone = businessPhone; }
    
    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }
    
    public String getOwnerTitle() { return ownerTitle; }
    public void setOwnerTitle(String ownerTitle) { this.ownerTitle = ownerTitle; }
    
    public String getVerificationDocument() { return verificationDocument; }
    public void setVerificationDocument(String verificationDocument) { this.verificationDocument = verificationDocument; }
    
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public Instant getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(Instant submittedAt) { this.submittedAt = submittedAt; }
    
    public Instant getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(Instant reviewedAt) { this.reviewedAt = reviewedAt; }
    
    public String getReviewedBy() { return reviewedBy; }
    public void setReviewedBy(String reviewedBy) { this.reviewedBy = reviewedBy; }
    
    public String getReviewNotes() { return reviewNotes; }
    public void setReviewNotes(String reviewNotes) { this.reviewNotes = reviewNotes; }
}
