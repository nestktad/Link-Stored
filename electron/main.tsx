'use client';

import { useState, useEffect } from 'react';

declare global {
    interface Window {
        electronAPI?: {
            saveFile: (data: any) => Promise<{ success: boolean; error?: string }>;
            readFile: () => Promise<{ success: boolean; data?: any; error?: string }>;
        };
    }
}

export default function Home() {
    const [isElectron, setIsElectron] = useState(false);
    const [data, setData] = useState('');
    const [savedData, setSavedData] = useState<any>(null);

    useEffect(() => {
        // Check if running in Electron
        setIsElectron(!!window.electronAPI);

        // Load saved data if in Electron
        if (window.electronAPI) {
            loadData();
        }
    }, []);

    const saveData = async () => {
        if (window.electronAPI && data.trim()) {
            const result = await window.electronAPI.saveFile({
                content: data,
                timestamp: new Date().toISOString()
            });

            if (result.success) {
                alert('Data saved successfully!');
                loadData();
            } else {
                alert('Error saving data: ' + result.error);
            }
        }
    };

    const loadData = async () => {
        if (window.electronAPI) {
            const result = await window.electronAPI.readFile();
            if (result.success && result.data) {
                setSavedData(result.data);
            }
        }
    };

    return (
        <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-8 text-center">LinkStore</h1>

    {isElectron ? (
        <div className="space-y-6">
        <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg">
        <p className="text-green-800 dark:text-green-200">
                ✅ Running in Desktop App (Electron)
    </p>
    </div>

    <div className="space-y-4">
    <div>
        <label className="block text-sm font-medium mb-2">
        Enter some data to save:
        </label>
        <textarea
        value={data}
        onChange={(e) => setData(e.target.value)}
        className="w-full p-3 border rounded-lg resize-none h-32 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
        placeholder="Type something here..."
            />
            </div>

            <div className="flex gap-4">
    <button
        onClick={saveData}
        disabled={!data.trim()}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
            Save to Local File
    </button>

    <button
        onClick={loadData}
        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
            Reload Data
    </button>
    </div>
    </div>

        {savedData && (
            <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold mb-2">Saved Data:</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Saved at: {new Date(savedData.timestamp).toLocaleString()}
            </p>
            <div className="bg-white dark:bg-gray-700 p-3 rounded border">
            {savedData.content}
            </div>
            </div>
        )}
        </div>
    ) : (
        <div className="space-y-4">
        <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
        <p className="text-blue-800 dark:text-blue-200">
                🌐 Running in Web Browser
    </p>
    <p className="text-sm text-blue-600 dark:text-blue-300 mt-2">
        To access local file features, run: <code className="bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded">npm run electron-dev</code>
    </p>
    </div>

    <div className="text-center">
    <h2 className="text-xl mb-4">Hello World</h2>
    <p className="text-gray-600 dark:text-gray-400">
        This is your Next.js app running in the browser.
    </p>
    </div>
    </div>
    )}
    </div>
    </div>
);
}