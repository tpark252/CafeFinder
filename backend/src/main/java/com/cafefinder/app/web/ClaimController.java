package com.cafefinder.app.web;

import com.cafefinder.app.dto.ClaimRequestDto;
import com.cafefinder.app.dto.ClaimReviewDto;
import com.cafefinder.app.model.Cafe;
import com.cafefinder.app.model.ClaimRequest;
import com.cafefinder.app.repo.CafeRepo;
import com.cafefinder.app.repo.ClaimRequestRepo;
import com.cafefinder.app.service.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/claims")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ClaimController {
    
    @Autowired
    private ClaimRequestRepo claimRequestRepo;
    
    @Autowired
    private CafeRepo cafeRepo;
    
    // Submit a claim request for a business
    @PostMapping("/request")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> submitClaimRequest(@Valid @RequestBody ClaimRequestDto claimDto, 
                                              Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            String userId = userDetails.getId();
            
            // Check if cafe exists
            Optional<Cafe> cafeOpt = cafeRepo.findById(claimDto.getCafeId());
            if (!cafeOpt.isPresent()) {
                return ResponseEntity.badRequest().body("Cafe not found");
            }
            
            Cafe cafe = cafeOpt.get();
            
            // Check if cafe is already claimed
            if (cafe.isClaimed()) {
                return ResponseEntity.badRequest().body("This business has already been claimed");
            }
            
            // Check if user has already submitted a claim for this cafe
            Optional<ClaimRequest> existingClaim = claimRequestRepo.findByCafeIdAndUserId(claimDto.getCafeId(), userId);
            if (existingClaim.isPresent()) {
                return ResponseEntity.badRequest().body("You have already submitted a claim for this business");
            }
            
            // Create new claim request
            ClaimRequest claimRequest = new ClaimRequest();
            claimRequest.setCafeId(claimDto.getCafeId());
            claimRequest.setUserId(userId);
            claimRequest.setBusinessEmail(claimDto.getBusinessEmail());
            claimRequest.setBusinessPhone(claimDto.getBusinessPhone());
            claimRequest.setOwnerName(claimDto.getOwnerName());
            claimRequest.setOwnerTitle(claimDto.getOwnerTitle());
            claimRequest.setReason(claimDto.getReason());
            
            claimRequest = claimRequestRepo.save(claimRequest);
            
            // Update cafe claim status to pending
            cafe.setClaimStatus("PENDING");
            cafeRepo.save(cafe);
            
            return ResponseEntity.ok().body("Claim request submitted successfully. We will review your request within 3-5 business days.");
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error submitting claim request: " + e.getMessage());
        }
    }
    
    // Get user's claim requests
    @GetMapping("/my-requests")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<ClaimRequest>> getMyClaimRequests(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getId();
        
        List<ClaimRequest> requests = claimRequestRepo.findByUserId(userId);
        return ResponseEntity.ok(requests);
    }
    
    // Get claim requests for a specific cafe
    @GetMapping("/cafe/{cafeId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ClaimRequest>> getClaimRequestsForCafe(@PathVariable String cafeId) {
        List<ClaimRequest> requests = claimRequestRepo.findByCafeId(cafeId);
        return ResponseEntity.ok(requests);
    }
    
    // Get all pending claim requests (admin only)
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ClaimRequest>> getPendingClaimRequests() {
        List<ClaimRequest> requests = claimRequestRepo.findByStatusOrderBySubmittedAtAsc("PENDING");
        return ResponseEntity.ok(requests);
    }
    
    // Review a claim request (admin only)
    @PostMapping("/review")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> reviewClaimRequest(@Valid @RequestBody ClaimReviewDto reviewDto,
                                              Authentication authentication) {
        try {
            UserDetailsImpl adminDetails = (UserDetailsImpl) authentication.getPrincipal();
            String adminId = adminDetails.getId();
            
            Optional<ClaimRequest> claimOpt = claimRequestRepo.findById(reviewDto.getClaimRequestId());
            if (!claimOpt.isPresent()) {
                return ResponseEntity.badRequest().body("Claim request not found");
            }
            
            ClaimRequest claimRequest = claimOpt.get();
            
            // Update claim request
            claimRequest.setStatus(reviewDto.getDecision());
            claimRequest.setReviewedAt(Instant.now());
            claimRequest.setReviewedBy(adminId);
            claimRequest.setReviewNotes(reviewDto.getReviewNotes());
            
            claimRequestRepo.save(claimRequest);
            
            // Update the cafe if approved
            Optional<Cafe> cafeOpt = cafeRepo.findById(claimRequest.getCafeId());
            if (cafeOpt.isPresent()) {
                Cafe cafe = cafeOpt.get();
                
                if ("APPROVED".equals(reviewDto.getDecision())) {
                    cafe.setClaimed(true);
                    cafe.setClaimStatus("VERIFIED");
                    cafe.setOwnerId(claimRequest.getUserId());
                    cafe.setClaimedAt(Instant.now());
                    cafe.setBusinessEmail(claimRequest.getBusinessEmail());
                    cafe.setVerified(true);
                } else {
                    cafe.setClaimStatus("REJECTED");
                }
                
                cafeRepo.save(cafe);
            }
            
            return ResponseEntity.ok().body("Claim request reviewed successfully");
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error reviewing claim request: " + e.getMessage());
        }
    }
    
    // Check if a cafe can be claimed
    @GetMapping("/can-claim/{cafeId}")
    public ResponseEntity<?> canClaimCafe(@PathVariable String cafeId) {
        Optional<Cafe> cafeOpt = cafeRepo.findById(cafeId);
        if (!cafeOpt.isPresent()) {
            return ResponseEntity.badRequest().body("Cafe not found");
        }
        
        Cafe cafe = cafeOpt.get();
        boolean canClaim = !cafe.isClaimed() && !"PENDING".equals(cafe.getClaimStatus());
        
        return ResponseEntity.ok().body(java.util.Map.of(
            "canClaim", canClaim,
            "isClaimed", cafe.isClaimed(),
            "claimStatus", cafe.getClaimStatus() != null ? cafe.getClaimStatus() : "UNCLAIMED"
        ));
    }
}
