from fastapi import FastAPI

app = FastAPI(title="Leave Planner API")


@app.get("/health")
def health():
    return {"status": "ok"}
