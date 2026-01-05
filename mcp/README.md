# TurnChat MCP Server

MCP server для управления историей чатов с поддержкой поиска, получения и сохранения сообщений.

**Соответствует спецификации OpenAI для ChatGPT Connectors и Deep Research.**

## Возможности

Этот MCP сервер предоставляет три инструмента:

- **search** ✅ (обязательный): Поиск по истории чатов - возвращает массив результатов с `id`, `title`, `url`
- **fetch** ✅ (обязательный): Получение полной истории чата - возвращает документ с `id`, `title`, `text`, `url`, `metadata`
- **store_chat** (дополнительный): Сохранение истории чата в базе данных

## Установка

### Через Docker

```bash
docker run -p 8888:3636 turnchat-mcp
```

### Локально

```bash
npm install
node server.js
```

Сервер будет доступен на `http://localhost:3636`

## Использование с Claude Desktop

Добавьте в конфигурацию Claude Desktop (`~/Library/Application Support/Claude/claude_desktop_config.json` на macOS или `%APPDATA%\Claude\claude_desktop_config.json` на Windows):

```json
{
  "mcpServers": {
    "turnchat": {
      "url": "http://localhost:8888"
    }
  }
}
```

## API

### search ✅ (OpenAI Spec Compatible)

Поиск по истории чатов. Возвращает массив результатов в формате, совместимом с ChatGPT и Deep Research.

**Параметры:**
- `query` (string): Строка поиска

**Возвращает:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "{\"results\":[{\"id\":\"chat_123\",\"title\":\"Chat Title\",\"url\":\"https://your-domain.com/chat/chat_123\"}]}"
    }
  ]
}
```

**Пример вызова:**
```json
{
  "query": "authentication"
}
```

### fetch ✅ (OpenAI Spec Compatible)

Получение полной истории чата. Возвращает документ в формате, совместимом с ChatGPT и Deep Research.

**Параметры:**
- `id` (string): ID чата

**Возвращает:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "{\"id\":\"chat_123\",\"title\":\"Chat Title\",\"text\":\"[USER]\\nHello\\n\\n[ASSISTANT]\\nHi there!\",\"url\":\"https://your-domain.com/chat/chat_123\",\"metadata\":{\"createdAt\":\"2026-01-05T15:00:00.000Z\",\"messageCount\":2,\"source\":\"turnchat_mcp\"}}"
    }
  ]
}
```

**Пример вызова:**
```json
{
  "id": "chat_123"
}
```

### store_chat

Сохранение истории чата.

**Параметры:**
- `id` (string): Уникальный ID чата
- `title` (string, опционально): Заголовок чата
- `messages` (array): Массив сообщений

**Пример:**
```json
{
  "id": "chat_123",
  "title": "Разговор о MCP",
  "messages": [
    {
      "role": "user",
      "content": "Как работает MCP?"
    },
    {
      "role": "assistant",
      "content": "MCP - это Model Context Protocol..."
    }
  ]
}
```

## Интеграция с ChatGPT

### Подключение через ChatGPT Connectors

1. Откройте ChatGPT Settings → Connectors → Advanced → Developer mode
2. Добавьте новый MCP сервер с URL: `http://your-domain:8888`
3. Сервер автоматически обнаружит инструменты `search` и `fetch`
4. Используйте "Deep Research" или "Use Connectors" в чате

### Использование через OpenAI API

```bash
curl https://api.openai.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
  "model": "o4-mini-deep-research",
  "input": [
    {
      "role": "developer",
      "content": [
        {
          "type": "input_text",
          "text": "You are a research assistant with access to chat history."
        }
      ]
    },
    {
      "role": "user",
      "content": [
        {
          "type": "input_text",
          "text": "Search for conversations about authentication"
        }
      ]
    }
  ],
  "reasoning": {
    "summary": "auto"
  },
  "tools": [
    {
      "type": "mcp",
      "server_label": "turnchat",
      "server_url": "http://your-domain:8888",
      "allowed_tools": ["search", "fetch"],
      "require_approval": "never"
    }
  ]
}'
```

### Тестирование в Prompts Dashboard

1. Зайдите на https://platform.openai.com/prompts
2. Создайте новый промпт
3. Добавьте MCP tool с URL вашего сервера
4. Тестируйте через Prompts UI

## Безопасность

⚠️ **Важно**: Этот сервер предоставляет доступ к истории чатов. Убедитесь что:

- Используете HTTPS для production
- Настроили OAuth аутентификацию
- Ограничили доступ к серверу
- Не храните чувствительные данные без шифрования

Подробнее о безопасности: https://platform.openai.com/docs/guides/mcp

## Разработка

```bash
npm install
node server.js
```

## Соответствие OpenAI Specification

✅ **search** tool - возвращает `{ results: [{id, title, url}] }`
✅ **fetch** tool - возвращает `{id, title, text, url, metadata}`
✅ SSE транспорт
✅ HTTP сервер
⚠️ OAuth - требуется настройка (см. секцию Безопасность)

## Лицензия

ISC
