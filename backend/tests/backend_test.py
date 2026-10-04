"""Live public API regression tests for invite time gates and lock behavior."""
import math
import os
from datetime import datetime

import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL")


@pytest.fixture(scope="module")
def api():
    if not BASE_URL:
        pytest.skip("REACT_APP_BACKEND_URL is not set")
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


# ---- /api/time live contract and no bypass ----
class TestLiveTime:
    def test_time_shape_and_dates(self, api):
        response = api.get(f"{BASE_URL.rstrip('/')}/api/time")
        assert response.status_code == 200
        assert "no-store" in (response.headers.get("Cache-Control") or "")

        data = response.json()
        assert data["event_at"] == "2026-12-06T00:00:00+05:30"
        assert data["dress_unlock_at"] == "2026-10-22T00:00:00+05:30"
        assert data["unlock_at"] == "2026-11-06T00:00:00+05:30"

        assert data["tabs"]["location"]["unlocked"] is True
        assert data["tabs"]["dress"]["unlock_at"] == "2026-10-22T00:00:00+05:30"
        assert data["tabs"]["sufi"]["unlock_at"] == "2026-11-06T00:00:00+05:30"
        assert data["tabs"]["daysix"]["unlock_at"] == "2026-11-06T00:00:00+05:30"

        server_ts = data["server_time"]
        event_ts = data["event_at"]
        computed = math.ceil((
            (
                datetime.fromisoformat(event_ts)
                - datetime.fromisoformat(server_ts)
            ).total_seconds()
        ) / 86400)
        assert data["days_to_go"] == max(0, computed)

    def test_time_query_params_do_not_unlock(self, api):
        response = api.get(
            f"{BASE_URL.rstrip('/')}/api/time",
            params={"key": "xxv-goa-2026", "preview": "xxv-goa-2026"},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["tabs"]["dress"]["unlocked"] is False
        assert data["tabs"]["sufi"]["unlocked"] is False
        assert data["tabs"]["daysix"]["unlocked"] is False


# ---- protected endpoints before unlock ----
class TestLiveProtectedEndpoints:
    def test_dress_code_locked_now(self, api):
        response = api.get(f"{BASE_URL.rstrip('/')}/api/dress-code")
        assert "no-store" in (response.headers.get("Cache-Control") or "")
        assert response.status_code == 423
        payload = response.json()
        assert "Dress Code unlocks on 22 October 2026" in payload["detail"]

    def test_events_locked_now(self, api):
        response = api.get(f"{BASE_URL.rstrip('/')}/api/events")
        assert "no-store" in (response.headers.get("Cache-Control") or "")
        assert response.status_code == 423
        payload = response.json()
        assert "wait" in payload["detail"].lower()

    def test_events_query_params_do_not_bypass(self, api):
        response = api.get(
            f"{BASE_URL.rstrip('/')}/api/events",
            params={"key": "xxv-goa-2026", "preview": "xxv-goa-2026"},
        )
        assert response.status_code == 423
