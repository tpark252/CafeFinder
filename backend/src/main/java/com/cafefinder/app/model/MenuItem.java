package com.cafefinder.app.model;

import java.util.List;

public class MenuItem {
    private String name;
    private String description;
    private String category; // "coffee", "food", "pastry", "drink"
    private double price;
    private boolean available;
    private List<String> dietaryInfo; // "vegan", "gluten_free", etc.

    public MenuItem() {}

    public MenuItem(String name, String description, String category, double price) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.price = price;
        this.available = true;
    }

    // Getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    
    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
    
    public List<String> getDietaryInfo() { return dietaryInfo; }
    public void setDietaryInfo(List<String> dietaryInfo) { this.dietaryInfo = dietaryInfo; }
}
