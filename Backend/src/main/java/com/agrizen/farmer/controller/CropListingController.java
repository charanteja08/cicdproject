package com.agrizen.farmer.controller;

import com.agrizen.farmer.entity.CropListing;
import com.agrizen.farmer.service.CropListingService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class CropListingController {

	private final CropListingService cropListingService;

	public CropListingController(CropListingService cropListingService) {
		this.cropListingService = cropListingService;
	}

	@PostMapping(value = "/farmers/{farmerId}/crops", consumes = {"multipart/form-data"})
	public ResponseEntity<CropListing> addCrop(
			@PathVariable Long farmerId,
			@RequestParam String cropName,
			@RequestParam String cropType,
			@RequestParam Integer quantity,
			@RequestParam BigDecimal price,
			@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate harvestDate,
			@RequestParam String location,
			@RequestParam(required = false) String description,
			@RequestParam(required = false) MultipartFile image
	) throws IOException {
		CropListing listing = cropListingService.createListing(
				farmerId, cropName, cropType, quantity, price, harvestDate, location, description, image
		);
		return ResponseEntity.ok(listing);
	}

	@GetMapping("/farmers/{farmerId}/crops")
	public ResponseEntity<List<CropListing>> listByFarmer(@PathVariable Long farmerId) {
		return ResponseEntity.ok(cropListingService.getByFarmer(farmerId));
	}

	@GetMapping("/crops")
	public ResponseEntity<List<CropListing>> listAll() {
		return ResponseEntity.ok(cropListingService.getAll());
	}

	@DeleteMapping("/crops/{cropId}")
	public ResponseEntity<Void> delete(@PathVariable Long cropId) {
		cropListingService.delete(cropId);
		return ResponseEntity.noContent().build();
	}
}


