import React, { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';

const StringCalculator: React.FC = () => {
  const [input, setInput] = useState('');
  const [size, setSize] = useState({
    bytes: 0,
    kb: 0,
    mb: 0,
  });

  useEffect(() => {
    const bytes = new Blob([input]).size;
    setSize({
      bytes,
      kb: bytes / 1024,
      mb: bytes / (1024 * 1024),
    });
  }, [input]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          String Size Calculator
        </h2>

        {/* Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Enter Text
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Type or paste your text here..."
          />
        </div>

        {/* Size Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-700">Bytes</span>
              <Calculator className="h-5 w-5 text-blue-700" />
            </div>
            <p className="text-2xl font-bold text-blue-900 mt-1">
              {size.bytes.toLocaleString()}
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-700">Kilobytes</span>
              <Calculator className="h-5 w-5 text-green-700" />
            </div>
            <p className="text-2xl font-bold text-green-900 mt-1">
              {size.kb.toFixed(2)} KB
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-purple-700">
                Megabytes
              </span>
              <Calculator className="h-5 w-5 text-purple-700" />
            </div>
            <p className="text-2xl font-bold text-purple-900 mt-1">
              {size.mb.toFixed(4)} MB
            </p>
          </div>
        </div>

        {/* Character Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <span className="text-sm font-medium text-gray-600">
              Characters (with spaces)
            </span>
            <p className="text-xl font-bold text-gray-900 mt-1">
              {input.length}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <span className="text-sm font-medium text-gray-600">
              Characters (without spaces)
            </span>
            <p className="text-xl font-bold text-gray-900 mt-1">
              {input.replace(/\s/g, '').length}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <span className="text-sm font-medium text-gray-600">Words</span>
            <p className="text-xl font-bold text-gray-900 mt-1">
              {input.trim() ? input.trim().split(/\s+/).length : 0}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <span className="text-sm font-medium text-gray-600">Lines</span>
            <p className="text-xl font-bold text-gray-900 mt-1">
              {input.trim() ? input.trim().split('\n').length : 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StringCalculator;