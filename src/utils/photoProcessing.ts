export interface ProcessedPhoto {
  base64Data: string;
  mimeType: string;
  previewUrl: string;
}

export function processRoofPhoto(file: File): Promise<ProcessedPhoto> {
  return new Promise((resolve, reject) => {
    // 1. Load the file with FileReader.readAsDataURL
    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error("Failed to read the selected file. Please select another image."));
    };

    reader.onload = () => {
      const dataUrl = reader.result as string;
      const img = new Image();

      const handleFallback = () => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedTypes.includes(file.type)) {
          const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
          if (match) {
            resolve({
              base64Data: match[2],
              mimeType: file.type,
              previewUrl: dataUrl,
            });
            return;
          }
        }
        reject(new Error("That format isn't supported — screenshot the photo and upload the screenshot."));
      };

      img.onerror = () => {
        handleFallback();
      };

      img.onload = () => {
        try {
          const maxDimension = 1400;
          let width = img.naturalWidth || img.width;
          let height = img.naturalHeight || img.height;

          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = Math.max(width, 1);
          canvas.height = Math.max(height, 1);
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            handleFallback();
            return;
          }

          // Draw image downsized onto canvas
          ctx.drawImage(img, 0, 0, width, height);

          // Re-encode to JPEG through canvas (quality ~0.85)
          const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.85);

          if (!jpegDataUrl || !jpegDataUrl.startsWith('data:image/jpeg;base64,')) {
            handleFallback();
            return;
          }

          const base64Data = jpegDataUrl.replace(/^data:image\/jpeg;base64,/, '');

          resolve({
            base64Data,
            mimeType: 'image/jpeg',
            previewUrl: jpegDataUrl,
          });
        } catch {
          handleFallback();
        }
      };

      img.src = dataUrl;
    };

    reader.readAsDataURL(file);
  });
}
