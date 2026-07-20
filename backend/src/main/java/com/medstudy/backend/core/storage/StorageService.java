package com.medstudy.backend.core.storage;

import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

public interface StorageService {
    /**
     * Uploads an image to the storage provider.
     * @param fileName The desired filename in the storage bucket.
     * @param inputStream The image content.
     * @return The public URL to access the uploaded image.
     */
    String uploadImage(String fileName, InputStream inputStream);
}
