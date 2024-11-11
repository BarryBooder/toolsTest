import React, { useState, useCallback } from 'react';
import { Upload, X } from 'lucide-react';

const ImageConverter: React.FC = () => {
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [quality, setQuality] = useState(80);
  const [converting, setConverting] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/') && !file.type.includes('webp')
    );
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, { file, preview: reader.result as string }]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter(file => 
        file.type.startsWith('image/') && !file.type.includes('webp')
      );
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages(prev => [...prev, { file, preview: reader.result as string }]);
        };
        reader.readAsDataURL(file);
      });
    }
  }, []);

  const convertToWebP = async () => {
    setConverting(true);
    
    for (const image of images) {
      const img = new Image();
      img.src = image.preview;
      
      await new Promise((resolve) => {
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            
            const webpBlob = await new Promise<Blob>((resolve) => {
              canvas.toBlob((blob) => {
                resolve(blob!);
              }, 'image/webp', quality / 100);
            });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(webpBlob);
            link.download = `${image.file.name.split('.')[0]}.webp`;
            link.click();
            URL.revokeObjectURL(link.href);
          }
          resolve(null);
        };
      });
    }
    
    setConverting(false);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Image to WebP Converter</h2>
        
        {/* Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors"
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Drag and drop images here, or{' '}
            <label className="text-blue-500 hover:text-blue-600 cursor-pointer">
              browse
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileInput}
              />
            </label>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Supports: JPG, PNG, GIF, BMP
          </p>
        </div>

        {/* Quality Slider */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">
            Quality: {quality}%
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
          />
        </div>

        {/* Image Preview */}
        {images.length > 0 && (
          <div className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image.preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Convert Button */}
        {images.length > 0 && (
          <button
            onClick={convertToWebP}
            disabled={converting}
            className={`mt-6 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              converting ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {converting ? 'Converting...' : `Convert ${images.length} image${images.length === 1 ? '' : 's'} to WebP`}
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageConverter;