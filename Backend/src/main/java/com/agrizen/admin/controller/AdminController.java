package com.agrizen.admin.controller;

import com.agrizen.auth.dto.UserDto;
import com.agrizen.auth.repository.UserRepository;
import com.agrizen.farmer.entity.CropListing;
import com.agrizen.farmer.entity.Farmer;
import com.agrizen.farmer.repository.CropListingRepository;
import com.agrizen.farmer.repository.FarmerRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminController {

    private final UserRepository userRepository;
    private final FarmerRepository farmerRepository;
    private final CropListingRepository cropListingRepository;

    public AdminController(UserRepository userRepository, 
                          FarmerRepository farmerRepository,
                          CropListingRepository cropListingRepository) {
        this.userRepository = userRepository;
        this.farmerRepository = farmerRepository;
        this.cropListingRepository = cropListingRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalFarmers", farmerRepository.count());
        stats.put("totalCrops", cropListingRepository.count());
        stats.put("totalBuyers", userRepository.count() - farmerRepository.count());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userRepository.findAll().stream()
                .map(UserDto::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @GetMapping("/farmers")
    public ResponseEntity<List<Farmer>> getAllFarmers() {
        return ResponseEntity.ok(farmerRepository.findAll());
    }

    @GetMapping("/crops")
    public ResponseEntity<List<CropListing>> getAllCrops() {
        return ResponseEntity.ok(cropListingRepository.findAll());
    }

    @GetMapping("/crops/category/{category}")
    public ResponseEntity<List<CropListing>> getCropsByCategory(@PathVariable String category) {
        List<CropListing> crops;
        if ("PRODUCTS".equals(category)) {
            // For PRODUCTS, include crops with null category or PRODUCTS category
            List<CropListing> allCrops = cropListingRepository.findAll();
            crops = allCrops.stream()
                    .filter(c -> c.getCategory() == null || "PRODUCTS".equals(c.getCategory()))
                    .collect(Collectors.toList());
        } else {
            crops = cropListingRepository.findByCategory(category);
        }
        return ResponseEntity.ok(crops);
    }

    @PutMapping("/crops/{id}/category")
    public ResponseEntity<CropListing> updateCropCategory(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        CropListing crop = cropListingRepository.findById(id).orElse(null);
        if (crop == null) {
            return ResponseEntity.notFound().build();
        }
        String category = request.get("category");
        crop.setCategory(category);
        cropListingRepository.save(crop);
        return ResponseEntity.ok(crop);
    }

    @PutMapping("/crops/{id}")
    public ResponseEntity<CropListing> updateCrop(
            @PathVariable Long id,
            @RequestBody CropListing updatedCrop) {
        CropListing crop = cropListingRepository.findById(id).orElse(null);
        if (crop == null) {
            return ResponseEntity.notFound().build();
        }
        // Update fields
        if (updatedCrop.getCropName() != null) crop.setCropName(updatedCrop.getCropName());
        if (updatedCrop.getCropType() != null) crop.setCropType(updatedCrop.getCropType());
        if (updatedCrop.getQuantity() != null) crop.setQuantity(updatedCrop.getQuantity());
        if (updatedCrop.getPrice() != null) crop.setPrice(updatedCrop.getPrice());
        if (updatedCrop.getLocation() != null) crop.setLocation(updatedCrop.getLocation());
        if (updatedCrop.getDescription() != null) crop.setDescription(updatedCrop.getDescription());
        if (updatedCrop.getCategory() != null) crop.setCategory(updatedCrop.getCategory());
        if (updatedCrop.getHarvestDate() != null) crop.setHarvestDate(updatedCrop.getHarvestDate());
        cropListingRepository.save(crop);
        return ResponseEntity.ok(crop);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/crops/{id}")
    public ResponseEntity<Void> deleteCrop(@PathVariable Long id) {
        if (cropListingRepository.existsById(id)) {
            cropListingRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}

