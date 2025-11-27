package com.agrizen.farmer.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.time.Instant;
import java.util.UUID;

@Service
public class ImageStorageService {

	@Value("${app.upload.dir:uploads}")
	private String uploadDir;

	@Value("${app.upload.base-url:/uploads}")
	private String uploadBaseUrl;

	public String saveFarmerCropImage(Long farmerId, MultipartFile file) throws IOException {
		if (file == null || file.isEmpty()) {
			return null;
		}
		String original = StringUtils.cleanPath(file.getOriginalFilename());
		String ext = "";
		int dot = original.lastIndexOf('.');
		if (dot >= 0 && dot < original.length() - 1) {
			ext = original.substring(dot);
		}
		String filename = UUID.randomUUID() + "-" + Instant.now().toEpochMilli() + ext;

		Path farmerFolder = Paths.get(uploadDir, "crops", String.valueOf(farmerId)).toAbsolutePath().normalize();
		Files.createDirectories(farmerFolder);

		Path target = farmerFolder.resolve(filename);
		Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

		String urlPath = uploadBaseUrl + "/crops/" + farmerId + "/" + filename;
		return urlPath;
	}
}


