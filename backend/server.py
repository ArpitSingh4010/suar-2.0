from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import math
import logging
from pathlib import Path
from datetime import datetime, timezone, timedelta

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.getenv('MONGO_URL')
client = AsyncIOMotorClient(mongo_url) if mongo_url else None
db = client[os.getenv('DB_NAME', 'anniversary')] if client else None

app = FastAPI()
api_router = APIRouter(prefix="/api")


@app.middleware("http")
async def prevent_stale_invitation_access(request, call_next):
    response = await call_next(request)
    if request.url.path in {"/api/time", "/api/events", "/api/dress-code"}:
        response.headers["Cache-Control"] = "no-store"
    return response

IST = timezone(timedelta(hours=5, minutes=30))
DRESS_UNLOCK_AT = datetime(2026, 10, 22, 0, 0, 0, tzinfo=IST)
UNLOCK_AT = datetime(2026, 11, 6, 0, 0, 0, tzinfo=IST)
EVENT_AT = datetime(2026, 12, 6, 0, 0, 0, tzinfo=IST)

IMG = "https://static.prod-images.emergentagent.com/jobs/5086c2dc-0475-4c4c-899a-06e43db56341/images/"

EVENTS = {
    "sufi": {
        "date": "05 DECEMBER 2026",
        "title": "SUFI NIGHT",
        "tagline": "An evening of soulful music, timeless melodies and unforgettable moments.",
        "closing": "Come closer. Let the music begin.",
        "images": {
            "performance": IMG + "6df34f94fc9795bbd23b8417d941b02b0d1f6e1c42ffb6f5a0a90f100fe1466d.jpeg",
            "guests": IMG + "de04e4f480b6b6fdf05f3b2022820a88e08bafc856c1eec7063912a6b40faddc.jpeg",
        },
    },
    "pool": {
        "date": "06 DECEMBER",
        "time": "MORNING",
        "title": "BIHARI POOL PARTY",
        "tagline": "A vibrant afternoon of music, sunshine, Bihari flavours and poolside celebrations.",
        "images": {
            "pool": IMG + "316d8a95f7c19a4f0dbd50bec96e775bda9bade6f5d2f0e9f99649162ba17669.jpeg",
            "water": IMG + "55d6133e2c49c10855916d3d8fec6a07d23f9e1856e02861302c6820625094b0.jpeg",
            "decor": IMG + "72321ec08b693cc0f82b0ff84fcd27988d9cde4e970f813d24e5843df752dc4a.jpeg",
        },
    },
    "masquerade": {
        "date": "06 DECEMBER",
        "time": "EVENING",
        "title": "THE MASQUERADE BALL",
        "tagline": "An evening of mystery, music and timeless elegance.",
        "images": {
            "mask": IMG + "717504f1e4ce57523cc56fcb4a8ca9932fb5031cc998ba4ceccb6781d2780e00.jpeg",
            "ballroom": IMG + "001efdf712c4a3ee7bd73202d4333ff61bb6656924eca984fb576b294879ee46.jpeg",
            "guests": IMG + "29a1e579d79295f334abeb901423539ffbe5a03eedaab50aeb9aeefb364ef784.jpeg",
        },
    },
    "finale": {
        "names": "NEHA & SAKET",
        "numeral": "25",
        "lines": [
            "25 years of love, laughter and memories.",
            "Now, let's celebrate the next chapter together.",
        ],
        "dates": "5–6 DECEMBER 2026",
        "place": "GOA",
    },
}


def access_at(now: datetime) -> dict:
    """Only server time can open a chapter; no URL or client-clock bypass."""
    return {
        "location": {"unlocked": True, "unlock_at": None},
        "dress": {"unlocked": now >= DRESS_UNLOCK_AT, "unlock_at": DRESS_UNLOCK_AT.isoformat()},
        "sufi": {"unlocked": now >= UNLOCK_AT, "unlock_at": UNLOCK_AT.isoformat()},
        "daysix": {"unlocked": now >= UNLOCK_AT, "unlock_at": UNLOCK_AT.isoformat()},
    }


@api_router.get("/")
async def root():
    return {"message": "Neha & Saket — 25"}


@api_router.get("/time")
async def get_time():
    now = datetime.now(timezone.utc)
    seconds_to_unlock = max(0, int((UNLOCK_AT - now).total_seconds()))
    days_to_go = max(0, math.ceil((EVENT_AT - now).total_seconds() / 86400))
    return {
        "server_time": now.isoformat(),
        "unlock_at": UNLOCK_AT.isoformat(),
        "event_at": EVENT_AT.isoformat(),
        "unlocked": now >= UNLOCK_AT,
        "dress_unlock_at": DRESS_UNLOCK_AT.isoformat(),
        "tabs": access_at(now),
        "seconds_to_unlock": seconds_to_unlock,
        "days_to_go": days_to_go,
    }


@api_router.get("/events")
async def get_events():
    now = datetime.now(timezone.utc)
    if now < UNLOCK_AT:
        raise HTTPException(status_code=423, detail="You'll have to wait a little more.")
    return EVENTS


@api_router.get("/dress-code")
async def get_dress_code():
    if datetime.now(timezone.utc) < DRESS_UNLOCK_AT:
        raise HTTPException(status_code=423, detail="Dress Code unlocks on 22 October 2026 at 12:00 AM IST.")
    from dress_code import DRESS_CODE
    return DRESS_CODE


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=False,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    if client:
        client.close()
