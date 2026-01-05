from fastapi import FastAPI
from fastapi.responses import PlainTextResponse, HTMLResponse
from pydantic import BaseModel

app = FastAPI()

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: list[Message]

@app.get("/", response_class=HTMLResponse)
async def root():
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Chat Export API</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .container {
                text-align: center;
                background: white;
                padding: 40px 60px;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            }
            h1 { color: #667eea; margin: 0 0 20px 0; }
            p { color: #666; font-size: 18px; }
            .status { color: #10b981; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 Сервис работает!</h1>
            <p>Chat History Export API</p>
            <p class="status">✓ Status: Running</p>
        </div>
    </body>
    </html>
    """

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/export", response_class=PlainTextResponse)
async def export_chat_history(request: ChatRequest):
    result = []
    for msg in request.messages:
        result.append(f"[{msg.role.upper()}]")
        result.append(msg.content)
        result.append("")
    return "\n".join(result)
