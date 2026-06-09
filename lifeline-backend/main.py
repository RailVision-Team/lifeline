from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from agents import get_agents
from state import get_state

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


@app.get("/agents")
def get_all_agents() -> list[dict]:
    """Returns all disaster response agents."""
    return get_agents()


@app.get("/state")
def get_system_state() -> dict:
    """Returns the current system state."""
    return get_state()