package com.agrizen.farmer.repository;

import com.agrizen.farmer.entity.CropListing;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CropListingRepository extends JpaRepository<CropListing, Long> {
	List<CropListing> findByFarmer_Id(Long farmerId);
	List<CropListing> findByCategory(String category);
}


