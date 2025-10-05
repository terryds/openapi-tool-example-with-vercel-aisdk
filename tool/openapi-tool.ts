import { UIToolInvocation, tool } from 'ai';
import { z } from 'zod';

export const openapiTool = tool({
  description: `Execute API requests based on OpenAPI specifications. 
  This is a generic tool that can call any API endpoint defined in an OpenAPI spec.
  Extract the base URL, endpoint path, method, and parameters from the OpenAPI specification before using this tool.
  
  Important: The base URL must be extracted from the OpenAPI spec's 'servers' section or endpoint-specific servers.`,
  inputSchema: z.object({
    baseUrl: z.string().describe('Base URL for the API (extract from OpenAPI spec servers section or endpoint servers)'),
    endpoint: z.string().describe('The API endpoint path (e.g., /v1/forecast, /api/users)'),
    method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']).describe('HTTP method from the OpenAPI spec'),
    queryParams: z.record(z.string(), z.any()).optional().describe('Query parameters as key-value pairs'),
    body: z.record(z.string(), z.any()).optional().describe('Request body for POST/PUT/PATCH requests'),
    headers: z.record(z.string(), z.string()).optional().describe('Additional headers (e.g., API keys, content-type)'),
  }),
  async *execute({ baseUrl, endpoint, method, queryParams, body, headers }) {
    yield { state: 'loading' as const, message: 'Preparing API request...' };

    try {
      // Construct URL with query parameters
      const url = new URL(endpoint, baseUrl);
      if (queryParams) {
        Object.entries(queryParams).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            // Handle arrays for query params
            if (Array.isArray(value)) {
              url.searchParams.append(key, value.join(','));
            } else {
              url.searchParams.append(key, String(value));
            }
          }
        });
      }

      yield { 
        state: 'loading' as const, 
        message: `Executing ${method} ${url.toString()}...` 
      };

      // Execute the fetch request
      const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      const options: RequestInit = {
        method,
        headers: {
          ...defaultHeaders,
          ...headers, // Allow custom headers to override defaults
        },
      };

      if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(url.toString(), options);
      const data = await response.json();

      if (!response.ok) {
        yield {
          state: 'error' as const,
          statusCode: response.status,
          error: data,
          message: `API request failed with status ${response.status}`,
        };
        return;
      }

      yield {
        state: 'success' as const,
        statusCode: response.status,
        data,
        url: url.toString(),
        message: 'API request completed successfully',
      };
    } catch (error) {
      yield {
        state: 'error' as const,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to execute API request',
      };
    }
  },
});

export type OpenAPIUIToolInvocation = UIToolInvocation<typeof openapiTool>;

