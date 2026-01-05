# Руководство по публикации TurnChat MCP Server

## Текущий статус

✅ MCP сервер запущен локально: `http://localhost:8888`
✅ Соответствует спецификации OpenAI (search + fetch tools)
✅ Документация готова (README.md)
✅ Docker конфигурация готова

## Шаги для публикации

### 1. Подготовка кода

#### Обновите домен в server.js

```bash
# Замените YOUR_DOMAIN на ваш реальный домен
# Файл: mcp/server.js
# Строки: ~29 и ~74
```

#### Обновите package.json

```bash
cd mcp
# Замените:
# - "author": "Your Name" → ваше имя
# - "url": "https://github.com/yourusername/turnchat" → ваш репозиторий
```

### 2. Создание GitHub репозитория

```bash
cd /home/dennis/turnchat
git init
git add .
git commit -m "Initial commit: TurnChat MCP Server"

# Создайте репозиторий на GitHub, затем:
git remote add origin https://github.com/yourusername/turnchat.git
git branch -M main
git push -u origin main
```

### 3. Деплой на облачную платформу

**Рекомендуемые платформы:**

#### Replit (самый простой)
1. Зайдите на https://replit.com
2. Нажмите "Create Repl" → "Import from GitHub"
3. Вставьте URL вашего репозитория
4. Replit автоматически:
   - Установит зависимости
   - Предоставит публичный HTTPS URL
   - Настроит автоматический деплой

#### Railway (профессиональный)
```bash
npm install -g @railway/cli
railway login
railway init
railway up
railway open  # Получите URL
```

#### Render (бесплатный tier)
1. Зайдите на https://render.com
2. New → Web Service
3. Подключите GitHub репозиторий
4. Настройте:
   - Build Command: `cd mcp && npm install`
   - Start Command: `cd mcp && node server.js`
   - Port: 3636

### 4. Тестирование production версии

```bash
# Проверка доступности
curl https://your-deployed-url.com

# Должен вернуть:
# HTTP/1.1 200 OK
# Content-Type: text/event-stream
```

### 5. Публикация в npm (опционально)

```bash
cd mcp

# Логин в npm
npm login

# Публикация
npm publish

# Теперь пользователи смогут установить:
# npx turnchat-mcp
```

### 6. Регистрация в MCP Registry

#### Anthropic MCP Registry

1. Зайдите на https://api.anthropic.com/mcp-registry/docs
2. Заполните форму:

```json
{
  "name": "turnchat-mcp",
  "displayName": "TurnChat - Chat History Search",
  "oneLiner": "Search and retrieve chat conversation history with MCP",
  "description": "MCP server for managing chat history with search, fetch, and store capabilities. Compatible with ChatGPT Connectors and Deep Research.",
  "documentation": "https://github.com/yourusername/turnchat/blob/main/mcp/README.md",
  "serverUrl": "https://your-deployed-url.com",
  "transport": "http",
  "worksWith": ["claude-api", "claude-desktop", "chatgpt"],
  "author": {
    "name": "Your Name",
    "email": "your@email.com",
    "url": "https://your-website.com"
  },
  "repository": "https://github.com/yourusername/turnchat",
  "keywords": ["mcp", "chat", "history", "search", "openai", "chatgpt", "claude"]
}
```

#### GitHub MCP Servers (официальная коллекция)

1. Fork репозиторий: https://github.com/modelcontextprotocol/servers
2. Добавьте ваш сервер в README
3. Создайте Pull Request

### 7. Подключение в ChatGPT

#### Для тестирования (Developer Mode)

1. ChatGPT → Settings → Connectors → Advanced
2. Включите "Developer mode" (требуется Pro/Plus)
3. Add MCP Server:
   - Name: `TurnChat`
   - URL: `https://your-deployed-url.com`
4. Протестируйте в чате через "Use Connectors"

#### Для пользователей (после публикации в реестре)

Пользователи смогут найти ваш сервер в:
- ChatGPT Connectors Store
- Claude Desktop настройках
- MCP Registry

### 8. Использование через API

```bash
curl https://api.openai.com/v1/responses \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "o4-mini-deep-research",
    "input": [
      {
        "role": "user",
        "content": [{"type": "input_text", "text": "Search chat history for authentication topics"}]
      }
    ],
    "tools": [{
      "type": "mcp",
      "server_url": "https://your-deployed-url.com",
      "allowed_tools": ["search", "fetch"]
    }]
  }'
```

## Чеклист публикации

- [ ] Обновить домен в server.js
- [ ] Обновить package.json (author, repository)
- [ ] Создать GitHub репозиторий
- [ ] Деплоить на облачную платформу
- [ ] Получить HTTPS URL
- [ ] Протестировать production версию
- [ ] Опубликовать в npm (опционально)
- [ ] Зарегистрировать в Anthropic MCP Registry
- [ ] Создать PR в github.com/modelcontextprotocol/servers
- [ ] Протестировать в ChatGPT Developer Mode
- [ ] Написать пост/анонс (Twitter, Reddit, Discord)

## Продвижение

После публикации:

1. **Twitter/X**: Анонсируйте с тегами `#MCP #ChatGPT #AI #Claude`
2. **Reddit**: r/ChatGPT, r/MachineLearning, r/LocalLLaMA
3. **Discord**: MCP Community Discord
4. **Dev.to**: Напишите статью "Building an MCP Server"
5. **GitHub**: Добавьте topics: `mcp`, `chatgpt`, `openai`, `claude`

## Поддержка пользователей

Подготовьте:
- GitHub Issues для bug reports
- Документацию с FAQ
- Примеры использования
- Video туториал (опционально)

## Мониторинг после запуска

Отслеживайте:
- GitHub Stars ⭐
- npm downloads (если опубликовали)
- Issues и feature requests
- Использование через API (если есть аналитика)

---

**Удачи с публикацией!** 🚀

Если нужна помощь на любом этапе - создайте issue на GitHub или напишите в MCP Community.
