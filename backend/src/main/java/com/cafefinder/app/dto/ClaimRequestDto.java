package com.cafefinder.app.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ClaimRequestDto {
    
    @NotBlank(message = "Cafe ID is required")
    private String cafeId;
    
    @NotBlank(message = "Business email is required")
    @Email(message = "Please provide a valid business email")
    private String businessEmail;
    
    @NotBlank(message = "Business phone is required")
    private String businessPhone;
    
    @NotBlank(message = "Owner name is required")
    @Size(min = 2, max = 100, message = "Owner name must be between 2 and 100 characters")
    private String ownerName;
    
    @NotBlank(message = "Owner title is required")
    @Size(min = 2, max = 50, message = "Owner title must be between 2 and 50 characters")
    private String ownerTitle;
    
    @Size(max = 500, message = "Reason cannot exceed 500 characters")
    private String reason;
    
    // Default constructor
    public ClaimRequestDto() {}
    
    // Getters and setters
    public String getCafeId() { return cafeId; }
    public void setCafeId(String cafeId) { this.cafeId = cafeId; }
    
    public String getBusinessEmail() { return businessEmail; }
    public void setBusinessEmail(String businessEmail) { this.businessEmail = businessEmail; }
    
    public String getBusinessPhone() { return businessPhone; }
    public void setBusinessPhone(String businessPhone) { this.businessPhone = businessPhone; }
    
    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }
    
    public String getOwnerTitle() { return ownerTitle; }
    public void setOwnerTitle(String ownerTitle) { this.ownerTitle = ownerTitle; }
    
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
