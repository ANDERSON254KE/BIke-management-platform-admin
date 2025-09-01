export const handleImageUpload = async (files: FileList): Promise<string[]> => {
  const uploadedImages: string[] = [];
  const fileArray = Array.from(files);
  
  for (const file of fileArray) {
    if (!file.type.startsWith('image/')) {
      throw new Error('Please select only image files');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image size should be less than 5MB');
    }

    const base64Image = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    uploadedImages.push(base64Image);
  }
  
  return uploadedImages;
};