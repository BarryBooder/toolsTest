import React, { useState, useCallback, useRef } from 'react';
import { Upload, X, Cpu } from 'lucide-react';

interface ConversionTask {
  file: File;
  preview: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
}

const ImageConverter: React.FC = () => {
  const [tasks, setTasks] = useState<ConversionTask[]>([]);
  const [quality, setQuality] = useState(80);
  const [threads, setThreads] = useState(4);
  const [isConverting, setIsConverting] = useState(false);
  const workers = useRef<Worker[]>([]);

  // Initialize or cleanup workers when thread count changes
  const updateWorkers = useCallback(() => {
    // Cleanup existing workers
    workers.current.forEach(worker => worker.terminate());
    workers.current = [];

    // Create new workers
    for (let i = 0; i < threads; i++) {
      const worker = new Worker(
        new URL('../../workers/webpWorker.ts', import.meta.url),
        { type: 'module' }
      );
      workers.current.push(worker);
    }
  }, [threads]);

  // Handle file selection
  const handleFiles = useCallback((files: File[]) => {
    const imageFiles = files.filter(file => 
      file.type.startsWith('image/') && !file.type.includes('webp')
    );
    
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTasks(prev => [...prev, {
          file,
          preview: reader.result as string,
          status: 'pending'
        }]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(Array.from(e.dataTransfer.files));
  }, [handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  }, [handleFiles]);

  const removeTask = (index: number) => {
    setTasks(prev => prev.filter((_, i) => i !== index));
  };

  const convertToWebP = async () => {
    if (isConverting) return;
    setIsConverting(true);
    updateWorkers();

    const pendingTasks = tasks.filter(task => task.status === 'pending');
    let completedCount = 0;

    // Process tasks in chunks based on thread count
    for (let i = 0; i < pendingTasks.length; i += threads) {
      const chunk = pendingTasks.slice(i, i + threads);
      const promises = chunk.map(async (task, index) => {
        const worker = workers.current[index % threads];
        
        // Update task status to processing
        setTasks(prev => prev.map(t => 
          t === task ? { ...t, status: 'processing' } : t
        ));

        try {
          // Create blob from preview
          const response = await fetch(task.preview);
          const blob = await response.blob();

          // Convert using worker
          const result = await new Promise((resolve, reject) => {
            worker.onmessage = (e) => {
              if (e.data.success) {
                resolve(e.data.blob);
              } else {
                reject(new Error(e.data.error));
              }
            };
            worker.onerror = reject;
            worker.postMessage({ 
              imageData: blob,
              quality 
            });
          });

          // Download the converted file
          const url = URL.createObjectURL(result as Blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${task.file.name.split('.')[0]}.webp`;
          link.click();
          URL.revokeObjectURL(url);

          // Update task status to completed
          setTasks(prev => prev.map(t => 
            t === task ? { ...t, status: 'completed' } : t
          ));
          completedCount++;
        } catch (error) {
          setTasks(prev => prev.map(t => 
            t === task ? { 
              ...t, 
              status: 'error',
              error: error instanceof Error ? error.message : 'Unknown error'
            } : t
          ));
        }
      });

      await Promise.all(promises);
    }

    // Cleanup workers
    workers.current.forEach(worker => worker.terminate());
    workers.current = [];
    setIsConverting(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Image to WebP Converter</h2>
        
        {/* Thread Control */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              Number of Threads: {threads}
            </div>
          </label>
          <input
            type="range"
            min="1"
            max="16"
            value={threads}
            onChange={(e) => setThreads(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-sm text-gray-500 mt-1">
            More threads can speed up conversion but use more system resources
          </p>
        </div>

        {/* Quality Slider */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quality: {quality}%
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full"
          />
        </div>
        
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

        {/* Task List */}
        {tasks.length > 0 && (
          <div className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.map((task, index) => (
                <div key={index} className="relative group border rounded-lg p-2">
                  <img
                    src={task.preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => removeTask(index)}
                      className="p-1 bg-red-500 text-white rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-2 text-sm">
                    {task.status === 'pending' && (
                      <span className="text-gray-600">Pending</span>
                    )}
                    {task.status === 'processing' && (
                      <span className="text-blue-600">Converting...</span>
                    )}
                    {task.status === 'completed' && (
                      <span className="text-green-600">Completed</span>
                    )}
                    {task.status === 'error' && (
                      <span className="text-red-600">{task.error}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Convert Button */}
        {tasks.length > 0 && (
          <button
            onClick={convertToWebP}
            disabled={isConverting}
            className={`mt-6 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isConverting ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isConverting 
              ? `Converting... (${tasks.filter(t => t.status === 'completed').length}/${tasks.length})`
              : `Convert ${tasks.length} image${tasks.length === 1 ? '' : 's'} to WebP`
            }
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageConverter;