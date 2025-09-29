package com.cafefinder.app.web;

import com.cafefinder.app.model.BusyEntry;
import com.cafefinder.app.repo.BusyRepo;
import com.cafefinder.app.repo.CafeRepo;
import com.cafefinder.app.service.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/busy")
public class BusyController {
    private final BusyRepo repo;
    
    @Autowired
    private CafeRepo cafeRepo;

    public BusyController(BusyRepo repo){ this.repo = repo; }

    @GetMapping("/public/cafe/{cafeId}")
    public List<BusyEntry> getBusyHistory(@PathVariable String cafeId, 
                                         @RequestParam(defaultValue = "24") int hours) {
        Instant since = Instant.now().minus(hours, ChronoUnit.HOURS);
        return repo.findByCafeIdAndTimestampAfterOrderByTimestampDesc(cafeId, since);
    }

    @GetMapping("/public/cafe/{cafeId}/current")
    public ResponseEntity<Map<String, Object>> getCurrentStatus(@PathVariable String cafeId) {
        // Get most recent entry within last 2 hours
        Instant twoHoursAgo = Instant.now().minus(2, ChronoUnit.HOURS);
        List<BusyEntry> recent = repo.findByCafeIdAndTimestampAfterOrderByTimestampDesc(cafeId, twoHoursAgo);
        
        if (recent.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                "status", "unknown",
                "crowdLevel", 0,
                "waitTime", null,
                "lastUpdated", null
            ));
        }

        BusyEntry latest = recent.get(0);
        return ResponseEntity.ok(Map.of(
            "status", getCrowdStatus(latest.getCrowdLevel()),
            "crowdLevel", latest.getCrowdLevel(),
            "waitTime", latest.getWaitMins(),
            "lastUpdated", latest.getTimestamp()
        ));
    }

    @GetMapping("/public/cafe/{cafeId}/hourly-trends")
    public Map<Integer, Double> getHourlyTrends(@PathVariable String cafeId, 
                                              @RequestParam(defaultValue = "7") int days) {
        Instant since = Instant.now().minus(days, ChronoUnit.DAYS);
        List<BusyEntry> entries = repo.findByCafeIdAndTimestampAfterOrderByTimestampDesc(cafeId, since);
        
        return entries.stream()
                .collect(Collectors.groupingBy(
                    entry -> LocalDateTime.ofInstant(entry.getTimestamp(), ZoneOffset.UTC).getHour(),
                    Collectors.averagingDouble(BusyEntry::getCrowdLevel)
                ));
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<BusyEntry> reportBusyStatus(@RequestBody BusyEntry busyEntry, Authentication auth) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        
        // Validate cafe exists
        if (!cafeRepo.existsById(busyEntry.getCafeId())) {
            return ResponseEntity.badRequest().build();
        }
        
        busyEntry.setTimestamp(Instant.now());
        
        // Validate crowd level is in range
        if (busyEntry.getCrowdLevel() < 0 || busyEntry.getCrowdLevel() > 100) {
            return ResponseEntity.badRequest().build();
        }
        
        BusyEntry saved = repo.save(busyEntry);
        
        // Update cafe current status
        updateCafeCurrentStatus(busyEntry.getCafeId(), saved);
        
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/cafe/{cafeId}/quick-report")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<BusyEntry> quickReport(@PathVariable String cafeId, 
                                               @RequestParam int crowdLevel,
                                               @RequestParam(required = false) Integer waitMins,
                                               Authentication auth) {
        BusyEntry entry = new BusyEntry();
        entry.setCafeId(cafeId);
        entry.setCrowdLevel(crowdLevel);
        entry.setWaitMins(waitMins);
        entry.setTimestamp(Instant.now());
        
        return reportBusyStatus(entry, auth);
    }

    private void updateCafeCurrentStatus(String cafeId, BusyEntry latestEntry) {
        cafeRepo.findById(cafeId).ifPresent(cafe -> {
            cafe.setCurrentStatus(getCrowdStatus(latestEntry.getCrowdLevel()));
            cafe.setCurrentWaitTime(latestEntry.getWaitMins());
            cafeRepo.save(cafe);
        });
    }

    private String getCrowdStatus(int crowdLevel) {
        if (crowdLevel <= 30) return "quiet";
        else if (crowdLevel <= 60) return "moderate";
        else if (crowdLevel <= 85) return "busy";
        else return "very_busy";
    }

    // Legacy endpoint for backward compatibility
    @GetMapping("/by-cafe/{cafeId}")
    public List<BusyEntry> byCafe(@PathVariable String cafeId){
        return repo.findByCafeIdOrderByTimestampDesc(cafeId);
    }
}
