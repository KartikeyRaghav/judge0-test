import React from 'react';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  language: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, language }) => {
  return (
    <div className="w-full">
      <div className="bg-gray-800 text-gray-300 px-4 py-2 text-sm font-mono rounded-t-lg border-b border-gray-600">
        {language} Code Editor
      </div>
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-64 p-4 font-mono text-sm bg-gray-900 text-gray-100 border border-gray-600 rounded-b-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Write your code here..."
        spellCheck={false}
      />
    </div>
  );
};