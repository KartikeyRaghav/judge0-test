import React, { useState } from 'react';
import { Play, Code } from 'lucide-react';
import { CodeEditor } from './components/CodeEditor';
import { LanguageSelector, languages } from './components/LanguageSelector';
import { ResultsDisplay } from './components/ResultsDisplay';
import { ApiKeyInput } from './components/ApiKeyInput';
import { Judge0Service } from './services/judge0Service';

interface SubmissionResult {
  stdout: string;
  stderr: string;
  compile_output: string;
  message: string;
  status: {
    id: number;
    description: string;
  };
  time: string;
  memory: number;
}

const defaultCode: Record<number, string> = {
  71: `# Python 3 Example
print("Hello, World!")
name = input("What's your name? ")
print(f"Nice to meet you, {name}!")`,
  63: `// JavaScript (Node.js) Example
console.log("Hello, World!");
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("What's your name? ", (name) => {
  console.log(\`Nice to meet you, \${name}!\`);
  rl.close();
});`,
  62: `// Java Example
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        Scanner scanner = new Scanner(System.in);
        System.out.print("What's your name? ");
        String name = scanner.nextLine();
        System.out.println("Nice to meet you, " + name + "!");
        scanner.close();
    }
}`,
  54: `// C++ Example
#include <iostream>
#include <string>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    cout << "What's your name? ";
    string name;
    getline(cin, name);
    cout << "Nice to meet you, " << name << "!" << endl;
    return 0;
}`,
  50: `// C Example
#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    printf("What's your name? ");
    char name[100];
    fgets(name, sizeof(name), stdin);
    printf("Nice to meet you, %s", name);
    return 0;
}`,
};

function App() {
  const [code, setCode] = useState(defaultCode[71] || '');
  const [selectedLanguage, setSelectedLanguage] = useState(71);
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [stdin, setStdin] = useState('World');

  const handleLanguageChange = (languageId: number) => {
    setSelectedLanguage(languageId);
    setCode(defaultCode[languageId] || '');
    setResult(null);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your RapidAPI key');
      return;
    }

    if (!code.trim()) {
      setError('Please enter some code to execute');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const judge0Service = new Judge0Service(apiKey);
      const submissionResult = await judge0Service.executeCode({
        source_code: code,
        language_id: selectedLanguage,
        stdin: stdin || undefined,
      });
      
      setResult(submissionResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedLang = languages.find(lang => lang.id === selectedLanguage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <Code className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Judge0 API Demo</h1>
              <p className="text-gray-600">Execute code in multiple programming languages</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Code Editor */}
          <div className="space-y-6">
            <ApiKeyInput apiKey={apiKey} onApiKeyChange={setApiKey} />
            
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
                <h2 className="text-lg font-semibold text-gray-900">Code Editor</h2>
                <LanguageSelector
                  selectedLanguage={selectedLanguage}
                  onLanguageChange={handleLanguageChange}
                />
              </div>
              
              <CodeEditor
                code={code}
                onChange={setCode}
                language={selectedLang?.name || 'Unknown'}
              />
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Standard Input (optional)
                </label>
                <input
                  type="text"
                  value={stdin}
                  onChange={(e) => setStdin(e.target.value)}
                  placeholder="Input for your program..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <button
                onClick={handleSubmit}
                disabled={isLoading || !apiKey.trim()}
                className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>{isLoading ? 'Executing...' : 'Run Code'}</span>
              </button>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Execution Results</h2>
              <ResultsDisplay result={result} isLoading={isLoading} error={error} />
            </div>
            
            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-blue-800 font-medium mb-3">How to use:</h3>
              <ol className="text-blue-700 text-sm space-y-2 list-decimal list-inside">
                <li>Get a free RapidAPI key from the Judge0 API page</li>
                <li>Enter your API key in the input field above</li>
                <li>Select your preferred programming language</li>
                <li>Write or modify the sample code</li>
                <li>Add any input your program needs</li>
                <li>Click "Run Code" to execute</li>
              </ol>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;