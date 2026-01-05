# Развертывание TurnChat MCP Server

## Быстрый старт (Production)

### 1. Обновите URL в коде

Замените `https://YOUR_DOMAIN` в `server.js` на ваш реальный домен:

```javascript
// В инструменте search (строка ~29)
url: `https://your-actual-domain.com/chat/${id}`,

// В инструменте fetch (строка ~74)
url: `https://your-actual-domain.com/chat/${chat.id}`,
```

### 2. Добавьте переменные окружения

Создайте файл `.env`:

```env
NODE_ENV=production
PORT=3636
DOMAIN=your-actual-domain.com
```

### 3. Деплой на облачную платформу

#### Replit (рекомендуется для тестирования)

1. Импортируйте проект на https://replit.com
2. Установите секрет `DOMAIN` с вашим доменом
3. Запустите сервер
4. Replit автоматически предоставит публичный URL

#### Railway / Render / Fly.io

```bash
# Railway
railway init
railway up

# Render
# Создайте Web Service в dashboard, подключите Git репозиторий

# Fly.io
fly launch
fly deploy
```

### 4. Настройка HTTPS

MCP серверы для production **должны** использовать HTTPS. Большинство платформ предоставляют это автоматически.

Для собственного сервера используйте Let's Encrypt:

```bash
# С nginx
sudo certbot --nginx -d your-domain.com
```

### 5. Подключение к ChatGPT

После развертывания:

1. Откройте ChatGPT → Settings → Connectors
2. Включите Developer mode (требуется Pro/Plus)
3. Добавьте MCP сервер: `https://your-domain.com`
4. Разрешите инструменты `search` и `fetch`

### 6. Тестирование

```bash
# Проверка доступности
curl https://your-domain.com

# Должен вернуть SSE stream с Content-Type: text/event-stream
```

## Production чеклист

- [ ] Замените `YOUR_DOMAIN` на реальный домен
- [ ] Настройте HTTPS
- [ ] Добавьте OAuth аутентификацию (опционально)
- [ ] Настройте CORS если нужно
- [ ] Подключите постоянное хранилище (вместо Map)
- [ ] Настройте логирование
- [ ] Добавьте rate limiting
- [ ] Настройте мониторинг

## OAuth аутентификация (рекомендуется)

Для production рекомендуется добавить OAuth. Пример с Passport.js:

```javascript
import passport from 'passport';
import { Strategy as OAuth2Strategy } from 'passport-oauth2';

passport.use(new OAuth2Strategy({
    authorizationURL: 'https://your-auth-provider.com/oauth/authorize',
    tokenURL: 'https://your-auth-provider.com/oauth/token',
    clientID: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    callbackURL: 'https://your-domain.com/auth/callback'
  },
  (accessToken, refreshToken, profile, cb) => {
    // Verify user
    return cb(null, profile);
  }
));
```

## Хранилище данных

Для production замените `Map` на реальную базу данных:

```javascript
// Redis
import { createClient } from 'redis';
const redis = createClient();

// MongoDB
import { MongoClient } from 'mongodb';
const client = new MongoClient(process.env.MONGODB_URI);

// PostgreSQL
import pg from 'pg';
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
```

## Мониторинг

Добавьте health check endpoint:

```javascript
if (req.method === "GET" && req.url === "/health") {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }));
  return;
}
```

## Публикация в MCP Registry

После развертывания отправьте заявку на https://api.anthropic.com/mcp-registry/docs

Требуемые метаданные:
- `displayName`: "TurnChat - Chat History Search"
- `oneLiner`: "Search and retrieve chat conversation history"
- `documentation`: ссылка на GitHub README
- `worksWith`: ["claude-api", "claude-desktop"]
- `serverUrl`: ваш production URL
- `transport`: "http"
