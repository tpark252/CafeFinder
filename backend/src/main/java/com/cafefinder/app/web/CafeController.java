package com.cafefinder.app.web;

import com.cafefinder.app.model.Cafe;
import com.cafefinder.app.repo.CafeRepo;
import com.cafefinder.app.service.CafeService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cafes")
public class CafeController {
    private final CafeRepo repo;
    private final CafeService service;

    public CafeController(CafeRepo repo, CafeService service){
        this.repo = repo;
        this.service = service;
    }

    @GetMapping("/public/search")
    public List<Cafe> search(
            @RequestParam(value="q", required=false) String q,
            @RequestParam(value="city", required=false) String city,
            @RequestParam(value="lat", required=false) Double lat,
            @RequestParam(value="lng", required=false) Double lng,
            @RequestParam(value="radius", required=false, defaultValue="10") Double radius,
            @RequestParam(value="wifi", required=false) Boolean wifi,
            @RequestParam(value="seating", required=false) Boolean seating,
            @RequestParam(value="workFriendly", required=false) Boolean workFriendly,
            @RequestParam(value="priceRange", required=false) String priceRange,
            @RequestParam(value="minRating", required=false) Double minRating
    ){
        return service.searchWithFilters(q, city, lat, lng, radius, wifi, seating, workFriendly, priceRange, minRating);
    }

    @GetMapping("/public/nearby")
    public List<Cafe> findNearby(
            @RequestParam("lat") double lat,
            @RequestParam("lng") double lng,
            @RequestParam(value="radius", defaultValue="5") double radius
    ) {
        return service.findNearby(lat, lng, radius);
    }

    @GetMapping("/public/popular")
    public List<Cafe> getPopular(@RequestParam(value="limit", defaultValue="10") int limit) {
        return service.getPopularCafes(limit);
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<Cafe> getPublic(@PathVariable String id){
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('OWNER') or hasRole('ADMIN')")
    public Cafe create(@RequestBody Cafe c){
        return service.createCafe(c);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('OWNER') or hasRole('ADMIN')")
    public ResponseEntity<Cafe> update(@PathVariable String id, @RequestBody Cafe cafe) {
        return repo.findById(id)
                .map(existingCafe -> {
                    cafe.setId(id);
                    return ResponseEntity.ok(service.updateCafe(cafe));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable String id) {
        return repo.findById(id)
                .map(cafe -> {
                    repo.delete(cafe);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/menu")
    public ResponseEntity<?> getMenu(@PathVariable String id) {
        return repo.findById(id)
                .map(cafe -> ResponseEntity.ok(cafe.getMenuItems()))
                .orElse(ResponseEntity.notFound().build());
    }
}
