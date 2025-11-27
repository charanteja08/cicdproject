package com.agrizen.farmer.service;

import com.agrizen.farmer.entity.CropListing;
import com.agrizen.farmer.entity.Farmer;
import com.agrizen.farmer.repository.CropListingRepository;
import com.agrizen.farmer.repository.FarmerRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class CropListingService {

	private final CropListingRepository cropListingRepository;
	private final FarmerRepository farmerRepository;
	private final ImageStorageService imageStorageService;

	public CropListingService(CropListingRepository cropListingRepository,
	                          FarmerRepository farmerRepository,
	                          ImageStorageService imageStorageService) {
		this.cropListingRepository = cropListingRepository;
		this.farmerRepository = farmerRepository;
		this.imageStorageService = imageStorageService;
	}

	public CropListing createListing(Long farmerId,
	                                 String cropName,
	                                 String cropType,
	                                 Integer quantity,
	                                 BigDecimal price,
	                                 LocalDate harvestDate,
	                                 String location,
	                                 String description,
	                                 MultipartFile image) throws IOException {
		Farmer farmer = farmerRepository.findById(farmerId)
				.orElseThrow(() -> new IllegalArgumentException("Farmer not found: " + farmerId));

		String imageUrl = null;
		if (image != null && !image.isEmpty()) {
			imageUrl = imageStorageService.saveFarmerCropImage(farmerId, image);
		}

		CropListing listing = new CropListing();
		listing.setFarmer(farmer);
		listing.setCropName(cropName);
		listing.setCropType(cropType);
		listing.setQuantity(quantity);
		listing.setPrice(price);
		listing.setHarvestDate(harvestDate);
		listing.setLocation(location);
		listing.setDescription(description);
		listing.setImageUrl(imageUrl);
		
		// Set category: All new crops go to NEW_ARRIVAL
		// If cropType is "Seeds & Saplings", also set category to SEEDS_SAPLINGS
		// Otherwise, category is NEW_ARRIVAL (which will show in Products tab)
		if ("Seeds & Saplings".equalsIgnoreCase(cropType)) {
			listing.setCategory("SEEDS_SAPLINGS");
		} else {
			listing.setCategory("NEW_ARRIVAL");
		}

		return cropListingRepository.save(listing);
	}

	public List<CropListing> getByFarmer(Long farmerId) {
		return cropListingRepository.findByFarmer_Id(farmerId);
	}

	public List<CropListing> getAll() {
		return cropListingRepository.findAll();
	}

	public void delete(Long listingId) {
		cropListingRepository.deleteById(listingId);
	}
}


