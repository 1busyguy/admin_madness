export const findPath = (parentPath: string, currentPath: string) =>
  currentPath.replace(parentPath, '').replace(/^\//, '');

export const convertFileToBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const isNilOrEmpty = (value: unknown): value is null | undefined => {
  if (value === null || value === undefined) {
    return true;
  }

  if (Array.isArray(value) || typeof value === 'string') {
    return value.length === 0;
  }

  if (value instanceof Date) {
    return isNaN(value.getTime());
  }

  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }

  return false;
};

export type ValueOf<T> = T[keyof T];

export const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        // Calculate aspect ratio
        const aspectRatio = img.width / img.height;

        let width = maxWidth;
        let height = maxHeight;

        if (img.width > img.height) {
          // Landscape image
          height = Math.min(maxHeight, maxWidth / aspectRatio);
          width = height * aspectRatio;
        } else {
          // Portrait or square image
          width = Math.min(maxWidth, maxHeight * aspectRatio);
          height = width / aspectRatio;
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.round(width);
        canvas.height = Math.round(height);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        // Draw the image to the canvas with proportional dimensions
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Convert canvas to a Blob and then to a File
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas toBlob failed'));
              return;
            }

            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          },
          file.type, // Preserve the original file type
          0.8, // Quality for JPEG
        );
      };

      img.onerror = (err) => reject(err);
      img.src = reader.result as string;
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};
