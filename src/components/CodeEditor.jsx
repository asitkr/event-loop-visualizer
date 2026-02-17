
import React from 'react';
import Editor from '@monaco-editor/react';

export const CodeEditor = ({ code, setCode }) => {
    return (
        <div className="w-full h-full border border-gray-700 rounded-lg overflow-hidden shadow-lg bg-[#1e1e1e]">
            <div className="bg-[#2d2d2d] px-4 py-2 text-sm text-gray-400 border-b border-gray-700 flex justify-between items-center">
                <span>script.js</span>
                <span className="text-xs text-gray-500">JavaScript</span>
            </div>
            <Editor
                height="100%"
                defaultLanguage="javascript"
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || '')}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: "'Fira Code', Consolas, monospace",
                    padding: { top: 16 },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                }}
            />
        </div>
    );
};
