# PWA Requirements — HamList

The product is an installable Progressive Web App with responsive desktop support. PWA installability is in scope; offline writes and push notifications are separate capabilities that must not be implied until implemented.

## Current implementation status (frontend phase)

- Manifest and standard/maskable PNG icons are present in `public/`.
- The production frontend registers `public/sw.js`; development mode does not register a worker.
- The worker caches only versioned public assets (app static chunks, font, icons, manifest) and provides `public/offline.html` for failed navigations. It does not cache user data, invitation URLs, or write requests.
- Install prompting is user-triggered where supported; iOS receives browser-specific Add to Home Screen instructions. A waiting worker is applied only after the user accepts the update action.
- Offline list editing, queued writes, private-data caching and synchronization are intentionally not implemented. This is a foundation, not a claim of full offline functionality.

## 1. Manifest

Production manifest proposal (values remain subject to final branding and deployment URL):

```json
{
  "id": "/",
  "name": "HamList — Shared Lists",
  "short_name": "HamList",
  "description": "Shared lists and everyday tasks, together.",
  "start_url": "/app/",
  "scope": "/",
  "display": "standalone",
  "orientation": "any",
  "theme_color": "#585fe8",
  "background_color": "#f5f6fb",
  "lang": "fa",
  "dir": "rtl",
  "categories": ["productivity", "lifestyle"]
}
```

Provide correctly sized 192×192 and 512×512 icons plus maskable variants. Do not rely on a favicon as the install icon. The app must still support English/LTR; the manifest's direction is only a default launch hint, not the selected in-app locale.

## 2. Install experience

- Show an install affordance only when the application is eligible or where platform-specific instructions are useful.
- Do not open an install prompt without a user gesture or repeat it after dismissal.
- Android/Chromium: use the browser's install prompt when available; also support its browser-menu install path.
- iOS/iPadOS: present short “Add to Home Screen” instructions where appropriate; do not promise a native prompt.
- After installation, verify standalone launch and app navigation. Keep a route back to the web version.
- Explain that installation does not create an account and is not a backup of user data.

## 3. Caching and privacy boundaries

### Safe baseline

- Cache versioned static app-shell assets and the offline fallback.
- Never use a broad cache-first policy for authenticated API responses.
- Scope any cached private data by authenticated user and version; clear it on logout, account switch, and account deletion.
- Avoid caching invite tokens, auth tokens, full request URLs containing secrets, or financial/health-like content in generic Cache Storage.
- Use bounded storage and graceful behavior when browser storage is cleared or evicted.

### Data model for offline use

- Phase 1: show the most recently synchronized, authorized data as read-only when offline; display its last-sync time.
- Preserve unsent form content as a local draft and mark it explicitly as not yet shared.
- Phase 2, only after conflict handling is ready: queue mutation commands in IndexedDB with client-generated IDs, base version, user/space scope, and idempotency key.
- On reconnect, retry with backoff; server authorization remains mandatory. Resolve concurrent edits instead of silently overwriting the newer version.
- Clearly show pending, synced, failed, and conflict states on each affected item.

## 4. Service worker lifecycle

- Version static caches and remove obsolete versions during activation.
- Do not force a page reload while a user is editing a form or has pending changes.
- Present “Update available” with an explicit update/reload action; explain when unsaved work exists.
- Offline fallback must make clear that the server cannot currently accept updates.
- Include a recovery path for a stuck or old service worker (reconnect/update/reload, with support guidance).

## 5. Notifications

Push is not required for installability and should not be conflated with local/in-app reminders.

- Ask for notification permission only after the user enables a specific reminder or notification feature.
- If permission is denied, keep in-app reminders usable and explain how to change the browser setting.
- Support per-category preferences and quiet hours before sending push/email.
- Store and revoke push subscriptions securely; do not send list contents in lock-screen messages by default.
- Handle unsupported browsers, revoked permissions, expired subscriptions, timezone changes, and duplicate delivery.

## 6. PWA release checklist

- [ ] Manifest is valid and hosted within the intended scope.
- [ ] Icons include standard and maskable variants with reviewed contrast.
- [ ] HTTPS, service worker registration, update lifecycle, and offline route work.
- [ ] Install prompt is user-triggered and does not nag after dismissal.
- [ ] Standalone display works on Android, iOS/iPadOS, Windows/macOS, and desktop browsers in the supported matrix.
- [ ] Persian RTL and English LTR work in installed and browser modes.
- [ ] Offline state clearly distinguishes cached read-only data from unsent drafts.
- [ ] A second account on the same device cannot see prior-account cached data after logout.
- [ ] Private API responses and secrets are not written to broad shared caches.
- [ ] Service-worker update does not discard forms or queued work.
- [ ] Push is optional, consent-based, and tested separately from the install flow.
