package com.medstudy.backend.core.storage;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
@Profile("!prod")
public class FileSystemStorageServiceImpl implements StorageService {

    private final String uploadDir = "uploads/profiles/";

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(Paths.get(uploadDir));
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory!");
        }
    }

    @Override
    public String uploadImage(String fileName, InputStream inputStream) {
        try {
            Path destinationFile = Paths.get(uploadDir).resolve(Paths.get(fileName))
                    .normalize().toAbsolutePath();
            
            Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            
            // Return local URL to serve the image
            return "http://localhost:8080/api/profiles/uploads/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file in local filesystem", e);
        }
    }
}
