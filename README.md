# Generic OpenAPI Agent Tool

A production-ready AI agent built with **Vercel AI SDK** that can execute real API requests based on any OpenAPI 3.0 specification. This project demonstrates how to create a generic, reusable tool that reads OpenAPI specs and makes intelligent API calls.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Vercel AI SDK](https://img.shields.io/badge/Vercel%20AI%20SDK-latest-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0-green)

## ✨ Features

- 🤖 **AI-Powered Agent** - Uses GPT-5-mini with Vercel AI SDK's experimental Agent API
- 📋 **Generic OpenAPI Tool** - Works with any OpenAPI 3.0 specification
- 🔄 **Dynamic Base URL Extraction** - Automatically reads base URLs from OpenAPI specs
- 🔐 **Authentication Support** - Handles API keys and custom headers
- 💬 **Interactive Chat UI** - Real-time streaming responses with tool invocation visualization
- 📊 **Response Viewer** - Collapsible, formatted JSON response display
- ⚡ **Streaming States** - Loading, success, and error states with detailed messages

## 🎯 What It Does

This agent can:
1. **Read OpenAPI specifications** embedded in its system context
2. **Answer questions** about API capabilities, endpoints, and parameters
3. **Execute real API calls** by extracting the correct base URL, endpoint, method, and parameters from the spec
4. **Display results** in a beautiful, interactive UI

### Example Use Case (Open-Meteo Weather API)

The demo includes the Open-Meteo Weather API spec. Ask questions like:

```
- "What's the weather in Tokyo?"
- "Get the hourly temperature forecast for New York"
- "What parameters does the forecast endpoint support?"
- "Show me the weather for coordinates 52.52, 13.41"
```

The agent will:
1. Extract the base URL (`https://api.open-meteo.com`) from the OpenAPI spec
2. Identify the correct endpoint (`/v1/forecast`)
3. Parse required parameters (latitude, longitude)
4. Execute the API request
5. Display the response in a formatted view

## 🏗️ Architecture

```
├── agent/
│   └── weather-agent.ts        # Agent configuration with OpenAPI spec context
├── tool/
│   └── openapi-tool.ts         # Generic OpenAPI execution tool
├── component/
│   ├── chat-input.tsx          # Chat input component
│   └── openapi-view.tsx        # Tool invocation display component
├── app/
│   ├── api/chat/route.ts       # Next.js API route for chat
│   └── page.tsx                # Main chat page
└── public/
    └── openapi-example.yml     # OpenAPI specification (Open-Meteo)
```

### Key Components

#### 1. Generic OpenAPI Tool (`tool/openapi-tool.ts`)

A completely generic tool that can execute any API request:

```typescript
{
  baseUrl: string,        // Required: Extracted from OpenAPI spec
  endpoint: string,       // API path (e.g., /v1/forecast)
  method: string,         // GET, POST, PUT, DELETE, PATCH
  queryParams?: object,   // Query parameters
  body?: object,          // Request body for POST/PUT/PATCH
  headers?: object        // Custom headers (auth, etc.)
}
```

#### 2. Agent Configuration (`agent/weather-agent.ts`)

- Loads OpenAPI spec at startup
- Embeds spec in system prompt
- Provides detailed instructions on extracting base URLs and parameters
- Guides the agent on when and how to use the tool

#### 3. Interactive UI (`component/openapi-view.tsx`)

Displays tool invocations with:
- Loading states with progress messages
- Success states with collapsible JSON responses
- Error states with status codes and error details

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm/bun
- OpenAI API key

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd demo-api-agent-tool
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Create .env.local file
echo "OPENAI_API_KEY=your-openai-api-key-here" > .env.local
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
```
http://localhost:3000
```

## 📝 Usage

### With the Default Open-Meteo API

Ask the agent questions like:
- "What's the current weather in London?"
- "Get the 7-day forecast for Paris"
- "What API endpoints are available?"
- "Show me weather data for latitude 40.7, longitude -74.0"

### Using a Different API

Want to use your own API? It's easy!

#### Step 1: Replace the OpenAPI Spec

Replace `public/openapi-example.yml` with your OpenAPI 3.0 specification:

```bash
cp /path/to/your/api-spec.yml public/openapi-example.yml
```

#### Step 2: Update Agent Context (Optional)

Edit `agent/weather-agent.ts` to customize the agent's expertise:

```typescript
system: `You are a helpful assistant with expertise in [YOUR API NAME]. 
You have access to the following OpenAPI specification:
...`
```

#### Step 3: That's It!

The agent will automatically:
- ✅ Extract base URLs from your spec
- ✅ Read available endpoints and methods
- ✅ Parse parameters and requirements
- ✅ Handle authentication if specified
- ✅ Execute properly formatted API calls

## 🔧 How It Works

### 1. OpenAPI Spec Loading

At startup, the agent loads the OpenAPI spec and embeds it in the system context:

```typescript
const openapiSpec = fs.readFileSync(
  path.join(process.cwd(), 'public', 'openapi-example.yml'),
  'utf-8'
);
```

### 2. Base URL Extraction

The agent extracts base URLs from the spec in this order:
1. Endpoint-specific `servers` (under each path)
2. Global `servers` (at root level)

Example:
```yaml
paths:
  /v1/forecast:
    servers:
      - url: https://api.open-meteo.com
    get:
      # endpoint details
```

### 3. Intelligent Tool Invocation

When you ask for data, the agent:
1. Analyzes your query
2. Extracts required information from the OpenAPI spec
3. Determines the correct endpoint and parameters
4. Calls the `openapi` tool with complete information

### 4. API Execution

The tool:
1. Constructs the full URL with base URL + endpoint + query params
2. Sets up headers (including authentication if provided)
3. Executes the fetch request
4. Streams the response state (loading → success/error)

## 🎨 Example API Interactions

### Example 1: Simple GET Request

**User:** "What's the weather in Tokyo?"

**Agent Process:**
1. Knows Tokyo coordinates (35.6762, 139.6503)
2. Extracts base URL from spec: `https://api.open-meteo.com`
3. Calls tool:
```typescript
{
  baseUrl: "https://api.open-meteo.com",
  endpoint: "/v1/forecast",
  method: "GET",
  queryParams: {
    latitude: 35.6762,
    longitude: 139.6503,
    current_weather: true
  }
}
```

### Example 2: Detailed Forecast

**User:** "Get hourly temperature and precipitation for New York"

**Agent Process:**
```typescript
{
  baseUrl: "https://api.open-meteo.com",
  endpoint: "/v1/forecast",
  method: "GET",
  queryParams: {
    latitude: 40.7128,
    longitude: -74.0060,
    hourly: ["temperature_2m", "precipitation"]
  }
}
```

### Example 3: API with Authentication

For APIs requiring authentication:

```yaml
components:
  securitySchemes:
    apiKey:
      type: apiKey
      in: header
      name: X-API-Key
```

**Agent calls:**
```typescript
{
  baseUrl: "https://api.example.com",
  endpoint: "/data",
  method: "GET",
  headers: {
    "X-API-Key": "your-api-key"
  }
}
```

## 📦 Tech Stack

- **Framework:** Next.js 15
- **AI SDK:** Vercel AI SDK (with experimental Agent API)
- **LLM:** OpenAI GPT-5-mini
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Validation:** Zod

## 🛠️ Project Structure

```
demo-api-agent-tool/
├── agent/                    # Agent configurations
│   └── weather-agent.ts      # Main agent with OpenAPI context
├── tool/                     # Tool definitions
│   └── openapi-tool.ts       # Generic OpenAPI executor
├── component/                # React components
│   ├── chat-input.tsx        # Chat input UI
│   └── openapi-view.tsx      # Tool result display
├── app/                      # Next.js app directory
│   ├── api/chat/            
│   │   └── route.ts          # Chat API endpoint
│   ├── page.tsx              # Main chat page
│   ├── layout.tsx            # App layout
│   └── globals.css           # Global styles
├── public/                   # Static files
│   └── openapi-example.yml   # OpenAPI specification
├── package.json              # Dependencies
└── tsconfig.json             # TypeScript config
```

## 🔑 Key Features Explained

### Generic & Reusable

The tool is **not** hardcoded for any specific API. It's designed to work with any OpenAPI 3.0 spec by:
- Reading the spec dynamically
- Extracting base URLs, endpoints, and parameters
- Handling different HTTP methods
- Supporting authentication schemes

### Streaming Responses

Uses Vercel AI SDK's streaming capabilities to provide real-time feedback:
```typescript
async *execute({ baseUrl, endpoint, method, queryParams }) {
  yield { state: 'loading', message: 'Preparing...' };
  // ... execute API call
  yield { state: 'success', data: result };
}
```

### Type-Safe

Full TypeScript support with Zod schemas for validation:
```typescript
inputSchema: z.object({
  baseUrl: z.string(),
  endpoint: z.string(),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
  // ...
})
```

### Error Handling

Comprehensive error handling with detailed messages:
- HTTP status codes
- Error responses from APIs
- Network errors
- Validation errors

## 🧪 Testing

Try these queries to test different capabilities:

**Basic Queries:**
- "What endpoints are available?"
- "What parameters does the forecast endpoint accept?"

**Data Retrieval:**
- "Get weather for London"
- "Show me the forecast for coordinates 48.8566, 2.3522"

**Complex Requests:**
- "Get hourly temperature, humidity, and wind speed for Seattle"
- "Show me the daily weather forecast for the next week in Berlin"

**API Understanding:**
- "What's the base URL for this API?"
- "Does this API require authentication?"
- "What response format does the forecast endpoint return?"

## 🚧 Extending the Project

### Add More Tools

Create additional tools in the `tool/` directory:

```typescript
export const myCustomTool = tool({
  description: 'Description of what this tool does',
  inputSchema: z.object({
    // parameters
  }),
  execute: async ({ params }) => {
    // implementation
  }
});
```

### Support Multiple APIs

Load multiple OpenAPI specs and let the agent choose:

```typescript
const weatherSpec = fs.readFileSync('public/weather-api.yml', 'utf-8');
const paymentSpec = fs.readFileSync('public/payment-api.yml', 'utf-8');

system: `You have access to multiple APIs:
<weather_api>${weatherSpec}</weather_api>
<payment_api>${paymentSpec}</payment_api>
...`
```

### Add Caching

Implement caching for API responses to reduce redundant calls.

### Add Rate Limiting

Protect your API keys by implementing rate limiting on the tool.

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 🙏 Acknowledgments

- Built with [Vercel AI SDK](https://sdk.vercel.ai/)
- Example API: [Open-Meteo](https://open-meteo.com/)
- Powered by [OpenAI](https://openai.com/)