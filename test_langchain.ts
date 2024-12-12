// Mock the OpenAI class
class MockChatOpenAI {
  private config: any;

  constructor(config: any) {
    this.config = config;
    console.log("Initialized with config:", JSON.stringify(config, null, 2));
  }

  async invoke(messages: Array<{role: string, content: string}>) {
    console.log("Received messages:", JSON.stringify(messages, null, 2));
    return {
      content: "This is a mock response from gpt-4o-mini via OpenRouter"
    };
  }
}

// Override the ChatOpenAI class globally
(globalThis as any).ChatOpenAI = MockChatOpenAI;

// Import our implementation
import { testOpenRouter } from "./utils/langchain.ts";

// Run the test
console.log("Testing OpenRouter integration with mock...\n");

testOpenRouter("mock-api-key").then(response => {
  console.log("\nFinal Response:", response);
}).catch(error => {
  console.error("Error:", error);
});
