import React, { useState } from 'react';
import { Copy, ChevronRight, ChevronDown } from 'lucide-react';

const JsonFormatter: React.FC = () => {
  const [input, setInput] = useState('');
  const [formatted, setFormatted] = useState<any>(null);
  const [error, setError] = useState('');
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input);
      setFormatted(parsed);
      setError('');
    } catch (err) {
      setError('Invalid JSON');
      setFormatted(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const togglePath = (path: string) => {
    const newPaths = new Set(expandedPaths);
    if (newPaths.has(path)) {
      newPaths.delete(path);
    } else {
      newPaths.add(path);
    }
    setExpandedPaths(newPaths);
  };

  const renderValue = (value: any, path: string = ''): JSX.Element => {
    if (value === null) return <span className="text-gray-500">null</span>;
    if (typeof value === 'boolean')
      return <span className="text-purple-600">{String(value)}</span>;
    if (typeof value === 'number')
      return <span className="text-blue-600">{value}</span>;
    if (typeof value === 'string')
      return <span className="text-green-600">"{value}"</span>;
    if (Array.isArray(value)) {
      const isExpanded = expandedPaths.has(path);
      return (
        <div>
          <button
            onClick={() => togglePath(path)}
            className="hover:bg-gray-100 rounded p-1"
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          <span className="text-gray-700">[</span>
          {isExpanded && (
            <div className="ml-4">
              {value.map((item, index) => (
                <div key={index}>
                  {renderValue(item, `${path}.${index}`)}
                  {index < value.length - 1 && (
                    <span className="text-gray-700">,</span>
                  )}
                </div>
              ))}
            </div>
          )}
          <span className="text-gray-700">]</span>
        </div>
      );
    }
    if (typeof value === 'object') {
      const isExpanded = expandedPaths.has(path);
      return (
        <div>
          <button
            onClick={() => togglePath(path)}
            className="hover:bg-gray-100 rounded p-1"
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          <span className="text-gray-700">{'{'}</span>
          {isExpanded && (
            <div className="ml-4">
              {Object.entries(value).map(([key, val], index, arr) => (
                <div key={key}>
                  <span className="text-red-600">"{key}"</span>
                  <span className="text-gray-700">: </span>
                  {renderValue(val, `${path}.${key}`)}
                  {index < arr.length - 1 && (
                    <span className="text-gray-700">,</span>
                  )}
                </div>
              ))}
            </div>
          )}
          <span className="text-gray-700">{'}'}</span>
        </div>
      );
    }
    return <span>{String(value)}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">JSON Formatter</h2>

        {/* Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            JSON Input
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
            placeholder="Paste your JSON here..."
          />
        </div>

        {/* Format Button */}
        <button
          onClick={formatJson}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 mb-4"
        >
          Format JSON
        </button>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Formatted Output */}
        {formatted && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Formatted JSON
              </label>
              <button
                onClick={() => copyToClipboard(JSON.stringify(formatted, null, 2))}
                className="flex items-center text-sm text-blue-600 hover:text-blue-700"
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </button>
            </div>
            <div className="border border-gray-300 rounded-md p-4 bg-gray-50 overflow-auto max-h-96 font-mono text-sm">
              {renderValue(formatted, 'root')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JsonFormatter;