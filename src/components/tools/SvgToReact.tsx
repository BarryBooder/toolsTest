import React, { useState } from 'react';
import { Upload } from 'lucide-react';

const SvgToReact: React.FC = () => {
  const [svgInput, setSvgInput] = useState('');
  const [componentName, setComponentName] = useState('IconComponent');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const convertToReactComponent = () => {
    try {
      // Basic validation
      if (!svgInput.includes('<svg')) {
        throw new Error('Invalid SVG input');
      }

      // Clean up SVG
      let cleanSvg = svgInput
        .replace(/\n/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      // Convert kebab-case to camelCase for attributes
      cleanSvg = cleanSvg.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

      // Replace class with className
      cleanSvg = cleanSvg.replace(/class=/g, 'className=');

      // Create the React component
      const componentCode = `import React from 'react';

interface ${componentName}Props {
  className?: string;
  width?: number | string;
  height?: number | string;
}

const ${componentName}: React.FC<${componentName}Props> = ({
  className = '',
  width = 24,
  height = 24
}) => {
  return (
    ${cleanSvg.replace(/<svg/, '<svg width={width} height={height} className={className}')}
  );
};

export default ${componentName};
`;

      setOutput(componentCode);
      setError('');
    } catch (err) {
      setError('Invalid SVG format. Please check your input.');
      setOutput('');
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData('text');
    setSvgInput(pastedText);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">SVG to React Component</h2>

        {/* Component Name Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Component Name
          </label>
          <input
            type="text"
            value={componentName}
            onChange={(e) => setComponentName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter component name..."
          />
        </div>

        {/* SVG Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SVG Code
          </label>
          <div className="relative">
            <textarea
              value={svgInput}
              onChange={(e) => setSvgInput(e.target.value)}
              onPaste={handlePaste}
              className="w-full h-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              placeholder="Paste your SVG code here..."
            />
            {!svgInput && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center text-gray-400">
                  <Upload className="mx-auto h-12 w-12 mb-2" />
                  <p className="text-sm">Paste SVG code here</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Convert Button */}
        <button
          onClick={convertToReactComponent}
          disabled={!svgInput}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            svgInput
              ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Convert to React Component
        </button>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Output */}
        {output && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                React Component
              </label>
              <button
                onClick={copyToClipboard}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Copy to Clipboard
              </button>
            </div>
            <pre className="w-full h-96 px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 overflow-auto">
              <code className="text-sm">{output}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default SvgToReact;