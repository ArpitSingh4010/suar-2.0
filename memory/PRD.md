# Saket & Neha | XXV — Cinematic Anniversary Invitation

## Original brief
Create a premium, cinematic, interactive invitation for Saket & Neha's 25th wedding anniversary in Goa, 5–6 December 2026. Preserve luxurious imagery, ambient sound, GSAP ScrollTrigger scenes, Lenis scrolling, progressive server-controlled reveals, and a ceremonial invitation opening.

## Latest approved request — 4 October 2026
- Four tabs, exactly: Location, Dress Code, 5th Dec, 6th Dec.
- Only Location initially available. Dress Code opens 22 October 2026, midnight IST (45 days before 6 December). Both event tabs open 6 November 2026, midnight IST (30 days before).
- Main countdown target is 6 December 2026, midnight IST. Days are live, not hardcoded to 60. User explicitly approved this interpretation.
- “The Candle”: complete darkness → one flickering golden candle flame → spreading warm glow revealing deep-red velvet → ceremonial envelope/seal → candle blows out → black → completed invitation and Open invitation button.
- Keep a more premium ceremonial gold seal sequence within the opening.
- “The Feather”: fourth-tab entry shows one black feather floating down on crimson, landing on a gold invitation, revealing “S & N | XXV”, then “The Masquerade Ball”.
- Comfortably larger typography across every page for older guests; preserve existing functional scenes and sound.
- User: “yes everything else works perfectly, just make the changes now”.
- Follow-up (same session): remove the countdown/timer from the opening; move the candle into a corner once lit so it cannot obstruct the envelope; make the seal visibly break; hide Open invitation until animation finishes; add top-right Skip for returning guests. ALL numerical timers/day counts removed from opening; backend countdown logic and locked-tab countdowns remain.

## Architecture
- React frontend, FastAPI backend, MongoDB client available but invitation data is static editorial content.
- Backend port 8001 / frontend 3000, supervisor-managed. API base from frontend REACT_APP_BACKEND_URL. Mongo from existing MONGO_URL / DB_NAME.
- `/api/time`: authoritative UTC server time, IST event/release dates, `tabs` map, compatibility `unlocked` flag, live day count.
- `/api/dress-code`: HTTP 423 before 22 October; static editorial dress-code payload after.
- `/api/events`: HTTP 423 before 6 November; Sufi / Pool / Masquerade / Finale data after.
- All date-sensitive API responses use Cache-Control: no-store.
- NO frontend or URL bypass. Old preview key intentionally retired to satisfy “only Location accessible”. No authentication or user accounts.
- Countdown uses a server timestamp plus performance.now() elapsed time; device wall-clock cannot grant access. Server polling at release boundaries, on reconnect/visibility and every minute. Failure keeps gated tabs locked.

## Important files
- `backend/server.py`: API, release schedule, access_at helper.
- `backend/dress_code.py`: dress-code content behind server date gate.
- `frontend/src/App.js`: tab orchestration, authorized content fetches, loading/error/retry, transitions.
- `frontend/src/hooks/useServerClock.js`: monotonic countdown and server-only access.
- `frontend/src/pages/LocationPage.jsx`: Goa hero and public anniversary/location information.
- `frontend/src/pages/DressCodePage.jsx`: preserved dress-code scroll scenes, now separated from Location and data-driven.
- `frontend/src/components/SealedInvitation.jsx`: Candle moves to top-left, visibly breaking seal, extinguish/black sequence; Open invitation is only mounted after completion. Top-right Skip advances to completed invitation.
- `frontend/src/components/CeremonialSeal.jsx`: embossed monogram, gold sweep, drawn fracture and two matched wax halves separating.
- `frontend/src/components/FeatherReveal.jsx`: fourth-tab ceremony; reduced-motion and keyboard controls.
- `frontend/src/components/Nav.jsx`, `LockedOverlay.jsx`, `Countdown.jsx`: four tabs, individual lock dates, accessible modal.
- `frontend/src/readability.css`: large stable type sizes, 44–48px controls, mobile navigation, containment.
- `frontend/src/ceremony.css`: candle/foil/velvet/feather styling.
- `frontend/src/App.css`: existing cinematic visual system.
- `frontend/public/images/black-feather.webp`: processed licensed Unsplash feather photograph, local alpha asset.
- `design_guidelines.json`: original art direction; this PRD overrides old tab names, dates and type sizes.

## Implemented 4 October 2026
- Four-tab navigation and backend-enforced 45-day/30-day release stages.
- Public Location page; protected Dress Code data endpoint; retired known preview bypass.
- Corrected all countdown calculations to 6 December 2026.
- Timer-free Candle opening, lit candle moves top-left, slow gold fracture and separating seal halves, flap/card reveal, extinguishing flame/smoke/black transition. CTA delayed until sequence finishes; accessible top-right Skip.
- Crimson Feather ceremony for fourth tab, monogram then ball title.
- Larger headings/body/dates/navigation/labels/footer and stronger contrast, fixed-size typography with mobile breakpoints.
- Responsive four-column mobile tabs, lock feedback for each stage, errors and retry controls.
- Overflow corrections: text wrapping and internally animated backgrounds instead of out-of-bounds scene layers. GSAP/Lenis preserved.
- Regression fixes: rapid header tab selections supersede/cancel previous transitions instead of being ignored; main uses a real boolean `inert` prop; Feather timeline explicitly holds its completed title before fading.

## Verification
- Final `yarn build`: passed after all opening/navigation changes.
- Updated opening verified at 1920×800 and 390×844: no countdown/day counter; candle clear of envelope at upper-left; visible seal fracture; CTA absent until full sequence completes; Skip reaches completed invitation; CTA enters Location. No overflow.
- Live preview APIs: `/api/time` returns correct dates and all three gated tabs locked; `/api/events` and `/api/dress-code` both return 423.
- Testing agent full backend suite: 15/15 passed; isolated date-boundary suite rerun after final changes: 10/10 passed (microsecond-before/exact/after Oct22 and Nov6, 45/30-day values, event-day zero).
- Agent report `/app/test_reports/iteration_1.json` initially identified ignored rapid DaySix header clicks and React inert warning. Both fixed and self-tested; see `/app/test_reports/final_verification.json` for final outcomes.
- Future-phase browser regression rerun using EXACT backend editorial content/assets (not agent's shortened sample fixtures): all dress scenes, Pool Party, Masquerade and Feather have zero horizontal-overflow offenders at desktop1920/mobile390.
- Direct Sufi→6th Dec header navigation passed three rapid repetitions per viewport; Feather monogram/title fully visible, Continue exits and re-enables main; timed title hold fixed.
- Real-API device clock test: advancing Date.now by 180 days does NOT unlock any of the three protected tabs. Locked modal uses correct server date, main inert only while modal open, no runtime errors, zero mobile overflow.
- Testing note: pre-navigation Date.now monkeypatch caused injected preview analytics recursion, not app failure. Final clock-tamper test blocks analytics ONLY in isolated browser context and applies offset after navigation. No application analytics/configuration changes. A transient preview502 recovered; frontend/API verified HTTP200.
- Browser evidence: `/root/.emergent/automation_output/20261004_110654` (opening); `20261004_112500` (real-content future phases + navigation); `20261004_113857` (clock/inert/runtime checks).
- No mocked APIs in application. Future-date tests may simulate server responses in isolated test browser contexts, never runtime bypasses.
- Existing images are illustrative. No RSVP/payment/map integrations requested or added.

## Priorities / next actions
- P0: None outstanding in requested scope; all reported findings resolved and tested.
- P1: User review of Candle/Feather pacing and older-guest readability.
- P2 (optional): Add confirmed venue/map directions when host supplies venue; not in current scope.

## Preservation requirements
- Keep ambient Web Audio toggle and scene chronology.
- No new auth or integrations required for current task.
- Respect reduced motion and keep all interactive/critical new elements identifiable by data-testid.
- Never restore query-string preview bypass or derive unlocked states from device time.