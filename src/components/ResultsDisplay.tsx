import React from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

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

interface ResultsDisplayProps {
  result: SubmissionResult | null;
  isLoading: boolean;
  error: string | null;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-blue-800 font-medium">Executing code...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-3">
          <XCircle className="w-6 h-6 text-red-600" />
          <span className="text-red-800 font-medium">Error</span>
        </div>
        <pre className="text-red-700 text-sm bg-red-100 p-3 rounded border overflow-x-auto">
          {error}
        </pre>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <div className="text-gray-500">
          <Clock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p>Submit your code to see execution results</p>
        </div>
      </div>
    );
  }

  const getStatusIcon = (statusId: number) => {
    if (statusId === 3) return <CheckCircle className="w-6 h-6 text-green-600" />;
    if (statusId === 4) return <XCircle className="w-6 h-6 text-red-600" />;
    if (statusId === 6) return <XCircle className="w-6 h-6 text-red-600" />;
    return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
  };

  const getStatusColor = (statusId: number) => {
    if (statusId === 3) return 'green';
    if (statusId === 4 || statusId === 6) return 'red';
    return 'yellow';
  };

  const statusColor = getStatusColor(result.status.id);

  return (
    <div className="space-y-4">
      {/* Status */}
      <div className={`bg-${statusColor}-50 border border-${statusColor}-200 rounded-lg p-4`}>
        <div className="flex items-center space-x-3">
          {getStatusIcon(result.status.id)}
          <div>
            <span className={`text-${statusColor}-800 font-medium`}>
              {result.status.description}
            </span>
            <div className={`text-${statusColor}-600 text-sm mt-1`}>
              Execution time: {result.time || 'N/A'}s | Memory: {result.memory || 'N/A'} KB
            </div>
          </div>
        </div>
      </div>

      {/* Output */}
      {result.stdout && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-green-800 font-medium mb-2">Output</h3>
          <pre className="text-green-700 text-sm bg-green-100 p-3 rounded border overflow-x-auto whitespace-pre-wrap">
            {result.stdout}
          </pre>
        </div>
      )}

      {/* Error Output */}
      {result.stderr && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium mb-2">Error Output</h3>
          <pre className="text-red-700 text-sm bg-red-100 p-3 rounded border overflow-x-auto whitespace-pre-wrap">
            {result.stderr}
          </pre>
        </div>
      )}

      {/* Compile Output */}
      {result.compile_output && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h3 className="text-orange-800 font-medium mb-2">Compile Output</h3>
          <pre className="text-orange-700 text-sm bg-orange-100 p-3 rounded border overflow-x-auto whitespace-pre-wrap">
            {result.compile_output}
          </pre>
        </div>
      )}
    </div>
  );
};