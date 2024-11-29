// Web Worker for WebP conversion
self.onmessage = async (e: MessageEvent) => {
  const { imageData, quality } = e.data;
  
  try {
    // Create an image from the data
    const img = await createImageBitmap(imageData);
    
    // Create a canvas and draw the image
    const canvas = new OffscreenCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(img, 0, 0);
      
      // Convert to WebP
      const blob = await canvas.convertToBlob({
        type: 'image/webp',
        quality: quality / 100
      });
      
      // Send back the converted blob
      self.postMessage({ success: true, blob });
    } else {
      throw new Error('Could not get canvas context');
    }
  } catch (error) {
    self.postMessage({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};