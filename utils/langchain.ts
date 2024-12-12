import { ChatOpenAI } from "npm:@langchain/openai@0.0.23";

// Simple types for our chat interface
interface Message {
  role: string;
  content: string;
}

interface ChatConfig {
  openAIApiKey: string;
  temperature: number;
  modelName: string;
  configuration: {
    baseURL: string;
    defaultHeaders: Record<string, string>;
  };
}

/**
 * Creates a chat model using OpenRouter with gpt-4o-mini
 * @param apiKey OpenRouter API key
 * @param temperature Temperature for response generation (0-1)
 */
export const createChatModel = (apiKey: string, temperature = 0.7) => {
  const config: ChatConfig = {
    openAIApiKey: apiKey,
    temperature,
    modelName: "gpt-4o-mini",
    configuration: {
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": "https://github.com/langchain-ai/langchainjs",
        "X-Title": "LangChain/Deno Integration"
      },
    },
  };
  
  return new ChatOpenAI(config);
};

/**
 * Creates a simple chat chain using OpenRouter with gpt-4o-mini
 * @param apiKey OpenRouter API key
 * @param systemPrompt System prompt to guide the model's behavior
 */
export const createChatChain = (apiKey: string, systemPrompt: string) => {
  const model = createChatModel(apiKey);

  return async (input: string) => {
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: input }
    ];
    
    const response = await model.invoke(messages);
    return response.content;
  };
};

// Example test function
export const testOpenRouter = async (apiKey: string) => {
  const chat = await createChatChain(
    apiKey,
    "You are a helpful assistant that provides concise responses."
  );
  
  const response = await chat("What is the capital of France?");
  return response;
};
