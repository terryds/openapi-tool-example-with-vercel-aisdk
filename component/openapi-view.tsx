import type { OpenAPIUIToolInvocation } from '@/tool/openapi-tool';

export default function OpenAPIView({
  invocation,
}: {
  invocation: OpenAPIUIToolInvocation;
}) {
  switch (invocation.state) {
    case 'input-streaming':
      return (
        <div className="text-gray-500 text-sm">
          <pre className="bg-gray-100 p-2 rounded">
            {JSON.stringify(invocation.input, null, 2)}
          </pre>
        </div>
      );
    
    case 'input-available':
      return (
        <div className="text-gray-500 text-sm">
          Preparing API call to {invocation.input.endpoint}...
        </div>
      );
    
    case 'output-available':
      if (invocation.output.state === 'loading') {
        return (
          <div className="text-blue-500 text-sm">
            🔄 {invocation.output.message || 'Loading...'}
          </div>
        );
      }
      
      if (invocation.output.state === 'error') {
        return (
          <div className="text-red-500 text-sm">
            <div className="font-semibold">❌ API Error</div>
            <div>{invocation.output.message}</div>
            {invocation.output.statusCode && (
              <div>Status Code: {invocation.output.statusCode}</div>
            )}
            {invocation.output.error && (
              <pre className="bg-red-50 p-2 rounded mt-1 text-xs overflow-auto">
                {JSON.stringify(invocation.output.error, null, 2)}
              </pre>
            )}
          </div>
        );
      }
      
      if (invocation.output.state === 'success') {
        return (
          <div className="text-green-700 text-sm">
            <div className="font-semibold">✅ {invocation.output.message}</div>
            <div className="text-xs text-gray-600 mt-1">
              {invocation.output.url}
            </div>
            <details className="mt-2">
              <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                View Response Data
              </summary>
              <pre className="bg-gray-100 p-2 rounded mt-1 text-xs overflow-auto max-h-64">
                {JSON.stringify(invocation.output.data, null, 2)}
              </pre>
            </details>
          </div>
        );
      }
      
      return (
        <div className="text-gray-500 text-sm">
          Processing API request...
        </div>
      );
    
    case 'output-error':
      return (
        <div className="text-red-500 text-sm">
          ❌ Error: {invocation.errorText}
        </div>
      );
  }
}

