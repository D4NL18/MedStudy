import { Injectable } from '@angular/core';


/**
 * Angular service responsible for Image Compressor-related HTTP communication and business logic.
 * @description Provides methods to interact with the backend API for Image Compressor operations.
 */
@Injectable({
  providedIn: 'root'
})
export class ImageCompressorService {
  compressImage(base64Str: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const max = 1200;

        if (width > height) {
          if (width > max) {
            height *= max / width;
            width = max;
          }
        } else {
          if (height > max) {
            width *= max / height;
            height = max;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/webp', 0.7));
      };
      img.onerror = (error) => reject(error);
    });
  }
}
