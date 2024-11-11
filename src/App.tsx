import React, { useState } from 'react';
import { Menu, X, Settings, Image, Code2, Terminal, FileJson, Calculator, Timer } from 'lucide-react';
import Sidebar from './components/Sidebar';
import ImageConverter from './components/tools/ImageConverter';
import SvgToReact from './components/tools/SvgToReact';
import CodeExecutor from './components/tools/CodeExecutor';
import Base64Tool from './components/tools/Base64Tool';
import JsonFormatter from './components/tools/JsonFormatter';
import StringCalculator from './components/tools/StringCalculator';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeToolId, setActiveToolId] = useState('image-converter');

  const tools = {
    office: [
      { id: 'image-converter', name: 'Image to WebP', icon: Image, component: ImageConverter },
      { id: 'svg-to-react', name: 'SVG to React', icon: Code2, component: SvgToReact },
      { id: 'code-executor', name: 'JS Code Executor', icon: Terminal, component: CodeExecutor },
      { id: 'base64', name: 'Base64 Tool', icon: Settings, component: Base64Tool },
      { id: 'json-formatter', name: 'JSON Formatter', icon: FileJson, component: JsonFormatter },
      { id: 'string-calculator', name: 'String Calculator', icon: Calculator, component: StringCalculator },
    ],
    life: []
  };

  const ActiveComponent = tools.office.find(tool => tool.id === activeToolId)?.component || ImageConverter;
  const activeToolName = tools.office.find(tool => tool.id === activeToolId)?.name || 'Image to WebP';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 bg-white border-b px-4 py-3 flex items-center justify-between lg:hidden">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg"
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h1 className="text-lg font-semibold text-gray-800">{activeToolName}</h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>

      <div className="flex">
        {/* Sidebar - Full screen on mobile when open */}
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          tools={tools}
          activeToolId={activeToolId}
          setActiveToolId={(id) => {
            setActiveToolId(id);
            setIsSidebarOpen(false); // Close sidebar on mobile after selection
          }}
        />

        {/* Main Content */}
        <main 
          className={`flex-1 p-4 lg:p-6 ${isSidebarOpen ? 'lg:ml-64' : ''}`}
          style={{ 
            minHeight: 'calc(100vh - 57px)', // Adjust for mobile header
            marginTop: '0px'
          }}
        >
          <div className="max-w-7xl mx-auto">
            <ActiveComponent />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;