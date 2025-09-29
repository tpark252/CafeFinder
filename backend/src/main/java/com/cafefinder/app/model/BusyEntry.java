package com.cafefinder.app.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Document(collection="busy_hours")
public class BusyEntry {
    @Id
    private String id;
    private String cafeId;
    private Instant timestamp;
    private int crowdLevel; // 0..100
    private Integer waitMins; // optional

    public String getId(){return id;}
    public void setId(String id){this.id=id;}
    public String getCafeId(){return cafeId;}
    public void setCafeId(String c){this.cafeId=c;}
    public Instant getTimestamp(){return timestamp;}
    public void setTimestamp(Instant t){this.timestamp=t;}
    public int getCrowdLevel(){return crowdLevel;}
    public void setCrowdLevel(int c){this.crowdLevel=c;}
    public Integer getWaitMins(){return waitMins;}
    public void setWaitMins(Integer w){this.waitMins=w;}
}
