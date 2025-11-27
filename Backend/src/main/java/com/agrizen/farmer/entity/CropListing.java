package com.agrizen.farmer.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "crop_listings")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class CropListing {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "crop_name", nullable = false, length = 120)
	private String cropName;

	@Column(name = "crop_type", nullable = false, length = 80)
	private String cropType;

	@Column(nullable = false)
	private Integer quantity;

	@Column(nullable = false, precision = 10, scale = 2)
	private BigDecimal price;

	@Column(name = "harvest_date", nullable = false)
	private LocalDate harvestDate;

	@Column(nullable = false, length = 150)
	private String location;

	@Column(columnDefinition = "TEXT")
	private String description;

	@Column(name = "image_url", length = 500)
	private String imageUrl;

	@Column(name = "category", length = 50)
	private String category; // PRODUCTS, NEW_ARRIVAL, SEEDS_SAPLINGS

	@ManyToOne(fetch = FetchType.EAGER, optional = false)
	@JoinColumn(name = "farmer_id", nullable = false)
	private Farmer farmer;

	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }
	public String getCropName() { return cropName; }
	public void setCropName(String cropName) { this.cropName = cropName; }
	public String getCropType() { return cropType; }
	public void setCropType(String cropType) { this.cropType = cropType; }
	public Integer getQuantity() { return quantity; }
	public void setQuantity(Integer quantity) { this.quantity = quantity; }
	public BigDecimal getPrice() { return price; }
	public void setPrice(BigDecimal price) { this.price = price; }
	public LocalDate getHarvestDate() { return harvestDate; }
	public void setHarvestDate(LocalDate harvestDate) { this.harvestDate = harvestDate; }
	public String getLocation() { return location; }
	public void setLocation(String location) { this.location = location; }
	public String getDescription() { return description; }
	public void setDescription(String description) { this.description = description; }
	public String getImageUrl() { return imageUrl; }
	public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
	public String getCategory() { return category; }
	public void setCategory(String category) { this.category = category; }
	public Farmer getFarmer() { return farmer; }
	public void setFarmer(Farmer farmer) { this.farmer = farmer; }
}


