from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
def root():
    return {"status": "lifeline backend running"}


@app.get("/health")
def health() -> dict[str, str]:
    return {
        "status": "healthy",
        "service": "lifeline-backend",
        "version": "1.0"
    }