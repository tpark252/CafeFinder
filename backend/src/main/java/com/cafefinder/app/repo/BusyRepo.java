package com.cafefinder.app.repo;

import com.cafefinder.app.model.BusyEntry;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.time.Instant;
import java.util.List;

public interface BusyRepo extends MongoRepository<BusyEntry, String> {
    List<BusyEntry> findByCafeIdOrderByTimestampDesc(String cafeId);
    List<BusyEntry> findByCafeIdAndTimestampAfterOrderByTimestampDesc(String cafeId, Instant after);
    BusyEntry findFirstByCafeIdOrderByTimestampDesc(String cafeId);
}
