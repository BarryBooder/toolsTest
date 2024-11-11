import React, { useState } from 'react';
import { Play, Trash } from 'lucide-react';

const CodeExecutor: React.FC = () => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const executeCode = () => {
    try {
      // Create a new function from the code and execute it
      const result = new Function(code)();
      setOutput(String(result));
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setOutput('');
    }
  };

  const clearConsole = () => {
    setOutput('');
    setError('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">JavaScript Code Executor</h2>

        {/* Code Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Code
          </label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
            placeholder="Enter your JavaScript code here..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={executeCode}
            disabled={!code}
            className={`flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              code
                ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center justify-center">
              <Play className="h-4 w-4 mr-2" />
              Execute Code
            </div>
          </button>
          <button
            onClick={clearConsole}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <div className="flex items-center justify-center">
              <Trash className="h-4 w-4 mr-2" />
              Clear Console
            </div>
          </button>
        </div>

        {/* Output/Error Display */}
        {(output || error) && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Console Output
            </label>
            <pre
              className={`w-full px-3 py-2 border rounded-md shadow-sm overflow-auto text-sm font-mono h-32 ${
                error
                  ? 'border-red-300 bg-red-50 text-red-700'
                  : 'border-green-300 bg-green-50 text-green-700'
              }`}
            >
              {error || output}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeExecutor;