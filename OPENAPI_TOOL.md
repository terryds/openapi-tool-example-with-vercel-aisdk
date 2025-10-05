# OpenAPI Tool - Usage Guide

This agent has a **generic OpenAPI tool** that can execute real API requests to any API based on OpenAPI specifications embedded in the agent's context.

## Features

✅ **Generic & Reusable**: Works with any OpenAPI 3.0 specification
✅ **Smart API Execution**: The agent reads the OpenAPI spec and executes properly formatted API calls
✅ **Automatic Base URL Extraction**: Extracts base URLs from the OpenAPI spec's servers section
✅ **Parameter Extraction**: Automatically extracts and uses the correct parameters from the spec
✅ **Authentication Support**: Handles custom headers for API keys and auth tokens
✅ **Error Handling**: Displays detailed error messages when API calls fail
✅ **Response Visualization**: Shows API responses in a collapsible, formatted view

## Example Queries

### 1. Get Current Weather for a City
```
What's the current weather in Tokyo?
```

The agent will:
- Know Tokyo's coordinates (lat: 35.6762, lon: 139.6503)
- Call the OpenAPI tool with endpoint `/v1/forecast`
- Include parameters: `latitude`, `longitude`, `current_weather: true`

### 2. Get Detailed Forecast
```
Get the hourly temperature and precipitation forecast for New York for the next 7 days
```

The agent will:
- Use NYC coordinates (lat: 40.7128, lon: -74.0060)
- Request hourly data with parameters: `hourly: ["temperature_2m", "precipitation"]`

### 3. Query About API Capabilities
```
What parameters does the forecast endpoint support?
```

The agent will reference the OpenAPI spec and list all available parameters.

### 4. Custom Location by Coordinates
```
Get weather for latitude 52.52, longitude 13.41 with celsius temperature
```

The agent will make an API call with exact coordinates and temperature unit.

## How It Works

1. **OpenAPI Spec in Context**: The full OpenAPI specification is loaded into the agent's system prompt at startup
2. **Base URL Extraction**: The agent extracts the base URL from the spec's `servers` section or endpoint-specific servers
3. **Tool Decision**: When you ask for data, the agent decides to use the `openapi` tool
4. **Parameter Extraction**: The agent extracts required parameters from your query and the spec
5. **API Execution**: The tool constructs the proper URL and executes a fetch request
6. **Response Display**: Results are shown in an interactive UI component

## Tool Implementation

The OpenAPI tool is **completely generic** and accepts:
- `baseUrl`: **Required** - Base URL extracted from the OpenAPI spec's servers section
- `endpoint`: API path (e.g., `/v1/forecast`, `/api/users`)
- `method`: HTTP method (GET, POST, PUT, DELETE, PATCH)
- `queryParams`: Optional object with query parameters
- `body`: Optional request body for POST/PUT/PATCH
- `headers`: Optional custom headers (e.g., API keys, authorization tokens)

## Using with Different APIs

This tool is designed to work with **any OpenAPI specification**. To use it with a different API:

1. Replace the OpenAPI spec file in `/public/openapi-example.yml`
2. Update the agent's system prompt context (the spec is auto-loaded)
3. The agent will automatically read the new spec and extract base URLs, endpoints, and parameters
4. No changes needed to the tool itself!

## View Components

- **OpenAPIView**: Displays the tool invocation states (loading, success, error) with interactive JSON response viewer

## Try It Out!

Start the dev server and ask questions like:
- "What's the weather in London?"
- "Show me the hourly forecast for Paris"
- "What API parameters are available?"
- "Get weather for coordinates 40.7, -74.0"

