import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";
import http from "http";

const chatStore = new Map();

const server = new Server(
  {
    name: "turnchat-mcp",
    version: "1.0.0",
  },
  {
    tools: {
      search: {
        description: "Search chat history by query string",
        inputSchema: z.object({
          query: z.string(),
        }),
        async execute({ query }) {
          const results = [];
          const queryLower = query.toLowerCase();

          for (const [id, chat] of chatStore.entries()) {
            if (JSON.stringify(chat).toLowerCase().includes(queryLower)) {
              results.push({
                id,
                title: chat.title || `Chat ${id}`,
                url: `https://YOUR_DOMAIN/chat/${id}`,
              });
            }
          }

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({ results }),
              },
            ],
          };
        },
      },

      fetch: {
        description: "Fetch full chat history by ID",
        inputSchema: z.object({
          id: z.string(),
        }),
        async execute({ id }) {
          const chat = chatStore.get(id);

          if (!chat) {
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({ error: "not_found", id }),
                },
              ],
            };
          }

          // Format messages as full text
          const messagesText = chat.messages
            .map(m => `[${m.role.toUpperCase()}]\n${m.content}`)
            .join("\n\n");

          // Return in the required format for ChatGPT/Deep Research
          const document = {
            id: chat.id,
            title: chat.title || `Chat ${chat.id}`,
            text: messagesText,
            url: `https://YOUR_DOMAIN/chat/${chat.id}`,
            metadata: {
              createdAt: chat.createdAt,
              messageCount: chat.messages.length,
              source: "turnchat_mcp",
            },
          };

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(document),
              },
            ],
          };
        },
      },

      store_chat: {
        description: "Store chat history",
        inputSchema: z.object({
          id: z.string(),
          title: z.string().optional(),
          messages: z.array(
            z.object({
              role: z.string(),
              content: z.string(),
            })
          ),
        }),
        async execute({ id, title, messages }) {
          chatStore.set(id, {
            id,
            title,
            messages,
            createdAt: new Date().toISOString(),
          });

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({ success: true }),
              },
            ],
          };
        },
      },
    },
  }
);

const httpServer = http.createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/") {
    const transport = new SSEServerTransport("/", res);
    await server.connect(transport);
    return;
  }

  res.writeHead(404);
  res.end();
});

httpServer.listen(3636, "0.0.0.0", () => {
  console.log("✅ MCP Server running on http://0.0.0.0:3636");
});