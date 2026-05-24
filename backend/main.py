from fastapi import FastAPI

app = FastAPI(
    title="COIL Backend",
    version="1.0.0"
)

@app.get("/")
async def root():
    return {"message": "Backend funcionando correctamente"}