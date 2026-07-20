package com.medstudy.backend.core.storage;

import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.UUID;

@Service
@Profile("prod")
public class GcpStorageServiceImpl implements StorageService {

    @Value("${gcp.bucket-name:mock-bucket}")
    private String bucketName;

    // Use default credentials or specific project config via environment variables.
    // If running without credentials in dev, this might fail unless mocked or configured properly.
    private final Storage storage;

    public GcpStorageServiceImpl() {
        // Initializes Google Cloud Storage client
        // It will automatically pick up GOOGLE_APPLICATION_CREDENTIALS env var
        this.storage = StorageOptions.getDefaultInstance().getService();
    }

    @Override
    public String uploadImage(String fileName, InputStream inputStream) {
        try {
            BlobId blobId = BlobId.of(bucketName, fileName);
            BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType("image/jpeg").build();
            
            // Convert InputStream to byte array since gcp storage create requires byte[] or path.
            // For streams, we can use createFrom
            storage.createFrom(blobInfo, inputStream);
            
            // Return public URL (assuming bucket objects are public)
            return String.format("https://storage.googleapis.com/%s/%s", bucketName, fileName);
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload image to GCP Storage", e);
        }
    }
}
