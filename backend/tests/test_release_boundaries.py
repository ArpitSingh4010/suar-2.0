"""Isolated boundary tests for server-time unlock rules using datetime monkeypatching."""
from datetime import datetime, timezone
from pathlib import Path
import sys

from fastapi.testclient import TestClient

sys.path.append(str(Path(__file__).resolve().parents[1]))
import server  # noqa: E402


def _freeze(monkeypatch, frozen_utc: datetime):
    class FrozenDateTime(datetime):
        @classmethod
        def now(cls, tz=None):
            if tz is None:
                return frozen_utc.replace(tzinfo=None)
            return frozen_utc.astimezone(tz)

    monkeypatch.setattr(server, "datetime", FrozenDateTime)


def _time_payload(client: TestClient):
    response = client.get("/api/time")
    assert response.status_code == 200
    return response.json()


# ---- Date boundary matrix: before/exact/after dress and events unlock ----
def test_before_dress_unlock_all_protected_locked(monkeypatch):
    _freeze(monkeypatch, datetime(2026, 10, 21, 18, 29, 59, tzinfo=timezone.utc))  # 23:59:59 IST
    client = TestClient(server.app)

    data = _time_payload(client)
    assert data["tabs"]["location"]["unlocked"] is True
    assert data["tabs"]["dress"]["unlocked"] is False
    assert data["tabs"]["sufi"]["unlocked"] is False
    assert data["tabs"]["daysix"]["unlocked"] is False

    assert client.get("/api/dress-code").status_code == 423
    assert client.get("/api/events").status_code == 423


def test_exactly_dress_unlock_only_dress_opens(monkeypatch):
    _freeze(monkeypatch, datetime(2026, 10, 21, 18, 30, 0, tzinfo=timezone.utc))  # 22 Oct 00:00 IST
    client = TestClient(server.app)

    data = _time_payload(client)
    assert data["tabs"]["dress"]["unlocked"] is True
    assert data["tabs"]["sufi"]["unlocked"] is False
    assert data["tabs"]["daysix"]["unlocked"] is False
    assert data["days_to_go"] == 45

    assert client.get("/api/dress-code").status_code == 200
    assert client.get("/api/events").status_code == 423


def test_after_dress_before_event_tabs(monkeypatch):
    _freeze(monkeypatch, datetime(2026, 10, 31, 12, 0, 0, tzinfo=timezone.utc))
    client = TestClient(server.app)
    data = _time_payload(client)

    assert data["tabs"]["dress"]["unlocked"] is True
    assert data["tabs"]["sufi"]["unlocked"] is False
    assert data["tabs"]["daysix"]["unlocked"] is False
    assert client.get("/api/dress-code").status_code == 200
    assert client.get("/api/events").status_code == 423


def test_exactly_event_tabs_unlock_both_event_tabs_open(monkeypatch):
    _freeze(monkeypatch, datetime(2026, 11, 5, 18, 30, 0, tzinfo=timezone.utc))  # 6 Nov 00:00 IST
    client = TestClient(server.app)

    data = _time_payload(client)
    assert data["unlocked"] is True
    assert data["tabs"]["dress"]["unlocked"] is True
    assert data["tabs"]["sufi"]["unlocked"] is True
    assert data["tabs"]["daysix"]["unlocked"] is True
    assert data["days_to_go"] == 30

    events = client.get("/api/events")
    assert events.status_code == 200
    payload = events.json()
    assert payload["masquerade"]["title"] == "THE MASQUERADE BALL"


def test_after_event_unlock_protected_content_available(monkeypatch):
    _freeze(monkeypatch, datetime(2026, 11, 7, 0, 0, 0, tzinfo=timezone.utc))
    client = TestClient(server.app)

    assert client.get("/api/events").status_code == 200
    dress = client.get("/api/dress-code")
    assert dress.status_code == 200
    assert dress.json()["intro"]["title"] == "THE DRESS CODE"


def test_event_day_countdown_reaches_zero(monkeypatch):
    _freeze(monkeypatch, datetime(2026, 12, 5, 18, 30, 0, tzinfo=timezone.utc))  # 6 Dec 00:00 IST
    client = TestClient(server.app)
    data = _time_payload(client)
    assert data["days_to_go"] == 0


# ---- Microsecond precision around unlock boundaries ----
def test_dress_unlock_1_microsecond_before(monkeypatch):
    _freeze(monkeypatch, datetime(2026, 10, 21, 18, 29, 59, 999999, tzinfo=timezone.utc))
    client = TestClient(server.app)
    data = _time_payload(client)
    assert data["tabs"]["dress"]["unlocked"] is False
    assert client.get("/api/dress-code").status_code == 423


def test_dress_unlock_1_microsecond_after(monkeypatch):
    _freeze(monkeypatch, datetime(2026, 10, 21, 18, 30, 0, 1, tzinfo=timezone.utc))
    client = TestClient(server.app)
    data = _time_payload(client)
    assert data["tabs"]["dress"]["unlocked"] is True
    assert client.get("/api/dress-code").status_code == 200


def test_event_unlock_1_microsecond_before(monkeypatch):
    _freeze(monkeypatch, datetime(2026, 11, 5, 18, 29, 59, 999999, tzinfo=timezone.utc))
    client = TestClient(server.app)
    data = _time_payload(client)
    assert data["tabs"]["sufi"]["unlocked"] is False
    assert data["tabs"]["daysix"]["unlocked"] is False
    assert client.get("/api/events").status_code == 423


def test_event_unlock_1_microsecond_after(monkeypatch):
    _freeze(monkeypatch, datetime(2026, 11, 5, 18, 30, 0, 1, tzinfo=timezone.utc))
    client = TestClient(server.app)
    data = _time_payload(client)
    assert data["tabs"]["sufi"]["unlocked"] is True
    assert data["tabs"]["daysix"]["unlocked"] is True
    assert client.get("/api/events").status_code == 200
