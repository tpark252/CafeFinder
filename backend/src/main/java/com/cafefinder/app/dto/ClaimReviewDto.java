package com.cafefinder.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class ClaimReviewDto {
    
    @NotBlank(message = "Claim request ID is required")
    private String claimRequestId;
    
    @NotNull(message = "Decision is required")
    @Pattern(regexp = "APPROVED|REJECTED", message = "Decision must be either APPROVED or REJECTED")
    private String decision;
    
    private String reviewNotes;
    
    // Default constructor
    public ClaimReviewDto() {}
    
    // Getters and setters
    public String getClaimRequestId() { return claimRequestId; }
    public void setClaimRequestId(String claimRequestId) { this.claimRequestId = claimRequestId; }
    
    public String getDecision() { return decision; }
    public void setDecision(String decision) { this.decision = decision; }
    
    public String getReviewNotes() { return reviewNotes; }
    public void setReviewNotes(String reviewNotes) { this.reviewNotes = reviewNotes; }
}
