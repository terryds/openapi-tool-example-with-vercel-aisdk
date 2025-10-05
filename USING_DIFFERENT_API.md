# Using the Generic OpenAPI Tool with Different APIs

The OpenAPI tool is completely generic and can work with any OpenAPI 3.0 specification. Here's how to swap to a different API:

## Steps to Use a Different API

### 1. Replace the OpenAPI Specification

Replace the file at `/public/openapi-example.yml` with your new OpenAPI spec:

```bash
# Example: Using a different API
cp /path/to/your/api-spec.yml public/openapi-example.yml
```

Or if you want to keep the original:
```bash
# Create a new spec file
cp public/openapi-example.yml public/openapi-example-backup.yml
# Add your new spec
cp /path/to/your/api-spec.yml public/my-api-spec.yml
```

### 2. Update the Agent to Load Your Spec

Edit `agent/weather-agent.ts`:

```typescript
// Change this line:
const openapiSpec = fs.readFileSync(
  path.join(process.cwd(), 'public', 'openapi-example.yml'),
  'utf-8'
);

// To point to your new spec:
const openapiSpec = fs.readFileSync(
  path.join(process.cwd(), 'public', 'my-api-spec.yml'),
  'utf-8'
);
```

### 3. Update the System Prompt (Optional)

Customize the agent's expertise in `agent/weather-agent.ts`:

```typescript
system: `You are a helpful assistant with expertise in the [YOUR API NAME]. 
You have access to the following OpenAPI specification:
...`
```

### 4. That's It!

The tool will automatically:
- ✅ Extract the base URL from your spec's `servers` section
- ✅ Read available endpoints and methods
- ✅ Parse required and optional parameters
- ✅ Handle authentication if defined in securitySchemes
- ✅ Execute API calls with proper formatting

## Example: Using a Public REST API

### Example 1: JSONPlaceholder API

If you had a JSONPlaceholder OpenAPI spec:

```yaml
openapi: 3.0.0
info:
  title: JSONPlaceholder
  version: 1.0.0
servers:
  - url: https://jsonplaceholder.typicode.com
paths:
  /posts:
    get:
      summary: Get all posts
      parameters:
        - name: userId
          in: query
          schema:
            type: integer
```

The agent would automatically know:
- Base URL: `https://jsonplaceholder.typicode.com`
- Endpoint: `/posts`
- Method: `GET`
- Query params: `userId` (optional)

User query: "Get all posts for user 1"

Agent would call:
```typescript
{
  baseUrl: "https://jsonplaceholder.typicode.com",
  endpoint: "/posts",
  method: "GET",
  queryParams: { userId: 1 }
}
```

### Example 2: API with Authentication

If your API requires an API key:

```yaml
openapi: 3.0.0
info:
  title: My Secure API
servers:
  - url: https://api.example.com
paths:
  /data:
    get:
      security:
        - apiKey: []
components:
  securitySchemes:
    apiKey:
      type: apiKey
      in: header
      name: X-API-Key
```

The agent would extract the auth requirement and call:
```typescript
{
  baseUrl: "https://api.example.com",
  endpoint: "/data",
  method: "GET",
  headers: {
    "X-API-Key": "your-api-key-here"
  }
}
```

## Important Notes

### Base URL Extraction

The tool looks for base URLs in this order:
1. Endpoint-specific `servers` (defined under the path)
2. Global `servers` (defined at the root level)

Example with endpoint-specific server:
```yaml
paths:
  /v1/forecast:
    servers:
      - url: https://api.open-meteo.com
    get:
      # endpoint definition
```

### Multiple Servers

If your spec has multiple servers, the agent will use the first one by default, or you can instruct it to use a specific environment:

```yaml
servers:
  - url: https://api.example.com
    description: Production
  - url: https://staging.api.example.com
    description: Staging
```

### Complex Parameters

The tool handles:
- ✅ Query parameters (simple and arrays)
- ✅ Path parameters (e.g., `/users/{userId}`)
- ✅ Request bodies (JSON)
- ✅ Custom headers
- ✅ Different content types

## Testing Your New API

Start the dev server and try queries like:
```
- "List all [resources] from the API"
- "Get [resource] with ID 123"
- "Create a new [resource] with [properties]"
- "What endpoints are available in the API?"
- "What parameters does the [endpoint] accept?"
```

The agent will read your OpenAPI spec and execute the appropriate API calls!

