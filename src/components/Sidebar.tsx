import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  icon: LucideIcon;
  component: React.ComponentType;
}

interface Tools {
  office: Tool[];
  life: Tool[];
}

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  tools: Tools;
  activeToolId: string;
  setActiveToolId: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  tools,
  activeToolId,
  setActiveToolId,
}) => {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-full lg:w-64 bg-white border-r transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-200 ease-in-out ${
        isOpen ? 'top-[57px] lg:top-0' : 'top-0'
      }`}
    >
      <div className="h-full flex flex-col">
        <div className="p-4 border-b hidden lg:block">
          <h1 className="text-xl font-bold text-gray-800">Digital Tools</h1>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-8">
            <div>
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Digital Office
              </h2>
              <div className="space-y-1">
                {tools.office.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => setActiveToolId(tool.id)}
                    className={`w-full flex items-center px-3 py-3 text-base lg:text-sm rounded-lg transition-colors ${
                      activeToolId === tool.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <tool.icon className="h-5 w-5 mr-3" />
                    {tool.name}
                  </button>
                ))}
              </div>
            </div>

            {tools.life.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Digital Life
                </h2>
                <div className="space-y-1">
                  {tools.life.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => setActiveToolId(tool.id)}
                      className={`w-full flex items-center px-3 py-3 text-base lg:text-sm rounded-lg transition-colors ${
                        activeToolId === tool.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <tool.icon className="h-5 w-5 mr-3" />
                      {tool.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;