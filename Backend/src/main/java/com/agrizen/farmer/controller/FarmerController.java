package com.agrizen.farmer.controller;

import com.agrizen.farmer.entity.Farmer;
import com.agrizen.farmer.repository.FarmerRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/farmers")
@CrossOrigin
public class FarmerController {

	private final FarmerRepository farmerRepository;

	public FarmerController(FarmerRepository farmerRepository) {
		this.farmerRepository = farmerRepository;
	}

	@PostMapping
	public ResponseEntity<Farmer> create(@RequestBody Farmer farmer) {
		Farmer saved = farmerRepository.save(farmer);
		return ResponseEntity.created(URI.create("/api/farmers/" + saved.getId())).body(saved);
	}

	@GetMapping
	public ResponseEntity<java.util.List<Farmer>> getAll() {
		return ResponseEntity.ok(farmerRepository.findAll());
	}

	@GetMapping("/by-email")
	public ResponseEntity<Farmer> getByEmail(@RequestParam String email) {
		return farmerRepository.findByEmail(email)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}
}


