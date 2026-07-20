package com.medstudy.backend.core.utils;

import net.coobird.thumbnailator.Thumbnails;
import org.apache.tika.Tika;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Set;

public class ImageUtils {

    private static final Tika tika = new Tika();
    private static final Set<String> ALLOWED_MIME_TYPES = Set.of("image/jpeg", "image/png");
    private static final int TARGET_WIDTH = 500;
    private static final int TARGET_HEIGHT = 500;
    private static final float COMPRESSION_QUALITY = 0.8f;

    /**
     * Validates and compresses an uploaded image file.
     * Returns an InputStream of the processed image in JPEG format.
     */
    public static InputStream validateAndProcessImage(MultipartFile file) throws IOException, IllegalArgumentException {
        // Validate MIME type via Magic Bytes (Tika)
        try (InputStream is = file.getInputStream()) {
            String mimeType = tika.detect(is);
            if (!ALLOWED_MIME_TYPES.contains(mimeType)) {
                throw new IllegalArgumentException("Invalid file type: " + mimeType + ". Only JPEG and PNG are allowed.");
            }
        }

        // Compress and resize using Thumbnailator
        ByteArrayOutputStream os = new ByteArrayOutputStream();
        Thumbnails.of(file.getInputStream())
                .size(TARGET_WIDTH, TARGET_HEIGHT)
                .outputFormat("jpg")
                .outputQuality(COMPRESSION_QUALITY)
                .toOutputStream(os);

        return new ByteArrayInputStream(os.toByteArray());
    }
}
