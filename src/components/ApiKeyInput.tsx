import React, { useState } from 'react';
import { Key, Eye, EyeOff } from 'lucide-react';

interface ApiKeyInputProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ apiKey, onApiKeyChange }) => {
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-center space-x-2 mb-3">
        <Key className="w-5 h-5 text-yellow-600" />
        <h3 className="text-yellow-800 font-medium">RapidAPI Key</h3>
      </div>
      <p className="text-yellow-700 text-sm mb-3">
        To use Judge0 API, you need a RapidAPI key. Get one free at{' '}
        <a 
          href="https://rapidapi.com/judge0-official/api/judge0-ce" 
          target="_blank" 
          rel="noopener noreferrer"
          className="underline hover:text-yellow-800"
        >
          RapidAPI Judge0
        </a>
      </p>
      <div className="relative">
        <input
          type={showKey ? 'text' : 'password'}
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          placeholder="Enter your RapidAPI key"
          className="w-full px-3 py-2 pr-10 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
        />
        <button
          type="button"
          onClick={() => setShowKey(!showKey)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
