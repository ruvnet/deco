import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { createChatChain } from "../utils/langchain.ts";

const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>LangChain Test</title>
  </head>
  <body>
    <h1>LangChain Integration Test</h1>
    <div id="chat"></div>
    <form id="chat-form">
      <input type="text" id="message" placeholder="Type a message...">
      <button type="submit">Send</button>
    </form>
    <script>
      const form = document.getElementById('chat-form');
      const chat = document.getElementById('chat');
      
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = document.getElementById('message');
        const message = input.value;
        
        const response = await fetch('/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message })
        });
        
        const data = await response.json();
        const div = document.createElement('div');
        div.textContent = data.response;
        chat.appendChild(div);
        
        input.value = '';
      });
    </script>
  </body>
</html>
`;

// Initialize chat chain with mock
const chatChain = await createChatChain(
  "mock-api-key",
  "You are a helpful assistant that provides concise responses."
);

serve(async (req) => {
  if (req.method === "GET") {
    return new Response(html, {
      headers: { "content-type": "text/html" },
    });
  }

  if (req.method === "POST" && new URL(req.url).pathname === "/chat") {
    try {
      const { message } = await req.json();
      const response = await chatChain(message);
      return new Response(JSON.stringify({ response }), {
        headers: { "content-type": "application/json" },
      });
    } catch (err) {
      const error = err as Error;
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }
  }

  return new Response("Not Found", { status: 404 });
}, { port: 8000 });

console.log("Server running at http://localhost:8000");
