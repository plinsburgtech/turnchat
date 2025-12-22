from fastapi import FastAPI
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel

app = FastAPI()

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: list[Message]

@app.get("/")
async def root():
    return {"status": "ok", "message": "Chat History Export API is running"}

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
