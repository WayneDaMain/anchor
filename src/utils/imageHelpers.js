/**
 * Helper to compress and resize images client-side using HTML5 Canvas.
 * Returns a Promise that resolves to a Base64-encoded Data URL (image/jpeg).
 * 
 * @param {File} file - The file object from file input
 * @param {number} maxWidth - Maximum width of output image
 * @param {number} maxHeight - Maximum height of output image
 * @param {number} quality - Compression quality between 0.1 and 1.0 (default 0.7)
 * @returns {Promise<string>} Base64 Data URL
 */
export const compressImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file provided"));
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Export compressed Base64 Data URL (JPEG format)
        const base64DataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(base64DataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};
