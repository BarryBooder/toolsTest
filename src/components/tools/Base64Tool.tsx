import React, { useState, useCallback } from 'react';
import { Upload } from 'lucide-react';

const Base64Tool: React.FC = () => {
  const [text, setText] = useState('');
  const [base64, setBase64] = useState('');
  const [mode, setMode] = useState<'text' | 'image'>('text');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const encodeText = () => {
    try {
      const encoded = btoa(text);
      setBase64(encoded);
    } catch (error) {
      setBase64('Error: Invalid input for Base64 encoding');
    }
  };

  const decodeBase64 = () => {
    try {
      const decoded = atob(base64);
      setText(decoded);
    } catch (error) {
      setText('Error: Invalid Base64 string');
    }
  };

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setBase64(result.split(',')[1]);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setBase64(result.split(',')[1]);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Base64 Converter</h2>

        {/* Mode Toggle */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setMode('text')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
              mode === 'text'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Text
          </button>
          <button
            onClick={() => setMode('image')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
              mode === 'image'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Image
          </button>
        </div>

        {mode === 'text' ? (
          <>
            {/* Text Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Text
              </label>
              <div className="relative">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter text to encode..."
                />
                <button
                  onClick={() => copyToClipboard(text)}
                  className="absolute top-2 right-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 mb-4">
              <button
                onClick={encodeText}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Encode
              </button>
              <button
                onClick={decodeBase64}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Decode
              </button>
            </div>

            {/* Base64 Output */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Base64
              </label>
              <div className="relative">
                <textarea
                  value={base64}
                  onChange={(e) => setBase64(e.target.value)}
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Base64 string..."
                />
                <button
                  onClick={() => copyToClipboard(base64)}
                  className="absolute top-2 right-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  Copy
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Image Upload */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors mb-4"
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Drag and drop an image here, or{' '}
                <label className="text-blue-500 hover:text-blue-600 cursor-pointer">
                  browse
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </p>
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preview
                </label>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-full h-auto rounded-lg"
                />
              </div>
            )}

            {/* Base64 Output */}
            {base64 && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Base64 String
                  </label>
                  <button
                    onClick={() => copyToClipboard(base64)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Copy
                  </button>
                </div>
                <textarea
                  value={base64}
                  readOnly
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Base64Tool;