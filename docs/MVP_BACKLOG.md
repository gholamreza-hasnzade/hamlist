# MVP Backlog and Release Plan

This backlog turns the product brief and business flows into an implementation sequence. Estimates are intentionally omitted until the architecture, authentication method, and team capacity are confirmed.

## Gate 0 — Validate the problem before building

**Objective:** Verify that a shared, lightweight list solves a frequent real problem.

- Interview people from at least three use contexts: household, shared housing, friends/trips.
- Observe how they currently create, update, and share lists.
- Test the clickable wireframe with first-time users on both phone and desktop widths.
- Ask participants to create a list, add an item, invite someone, and mark an item complete without coaching.
- Record confusion, time to first value, and reasons they would return.
- Confirm the first release geography, auth method, legal/privacy requirements, and expected list size.

**Exit condition:** Users can explain the value in their own words and complete the core flow with little assistance. If not, revise the flow before implementation.

## Gate 1 — Product and technical foundations

### Epic 1: Installable PWA shell, visual system, and localization

- Implement application shell, desktop sidebar, mobile navigation, loading/empty/error states.
- Build reusable form, dialog, toast, list row, avatar, and confirmation components.
- Add real PWA installability: manifest, app icons, standalone display, service worker, update prompt, and graceful fallback when browser installation is unavailable.
- Cache the app shell; cache private list data only with user scoping and an explicit privacy policy. Clear private caches on sign-out/account switch.
- Define offline states: view last-synced authorized data; preserve unsent edits as pending drafts until conflict handling is implemented.
- Implement Persian/English catalogs, RTL/LTR logical layout, locale-aware dates/numbers.
- Verify keyboard navigation, visible focus, screen-reader labels, and mobile touch targets.

**Acceptance:** Switch locale without losing the current route or form state; all core screens work at narrow width in both directions. On supported browsers, install opens the app in standalone mode; when offline, the UI clearly distinguishes cached data from unsent changes.

### Epic 2: Identity and session

- Implement chosen sign-in method and session expiration/revocation.
- Preserve deep-link destination after sign-in, especially invitation URLs.
- Add account profile, sign-out, and session error states.
- Prevent accidental account enumeration in auth responses.

**Acceptance:** New user, returning user, expired link, invalid link, and expired session all have a recoverable route.

## Gate 2 — Core shared-list loop

### Epic 3: Spaces and membership

- Create personal or group space.
- List spaces the user can access.
- Owner/member role checks enforced by API, not only UI.
- Space settings: rename, archive, restore, leave, transfer ownership, delete.

**Acceptance:** A member cannot read or mutate an unjoined/private space by changing a URL or request payload.

### Epic 4: Lists and items

- Create, rename, archive, restore, and delete lists.
- Create, edit, complete, reopen, reorder, archive, and undo-delete items.
- Add notes and optional quantity; defer assignment/due date if it slows core validation.
- Add empty, loading, validation, and offline/error feedback.

**Acceptance:** Refreshing or signing in on another device does not lose saved data; completed items are distinct but recoverable.

### Epic 5: Invitations and join

- Create secure, revocable, expiring invite links.
- Preview the target space and role before join.
- Accept/reject, handle expired/revoked/already-member invitations.
- Remove member and rotate/revoke invites.
- Rate-limit invite creation and protect tokens from logs/analytics.

**Acceptance:** One successful invite results in exactly one membership; retrying the same request does not duplicate members.

### Epic 6: Collaboration and activity

- Persist updates with versioning and conflict handling.
- Show who added/completed an item and when.
- Decide refresh strategy (polling or real-time transport) based on expected scale.
- Provide retry states without silently overwriting simultaneous changes.

**Acceptance:** Two members editing the same list can see changes predictably and recover from conflict/network interruption.

## Gate 3 — Private pilot and quality

- Invite a small test cohort; instrument only privacy-reviewed product events.
- Review onboarding completion, invite acceptance, repeat use, and reports.
- Fix high-frequency usability blockers before adding reminders or expenses.
- Run security review for access control, invite-token handling, session management, and data export/delete.
- Run accessibility and localization QA in Persian RTL and English LTR.
- Create support/runbook flows: service outage, failed invite, lost access, data deletion.

**Pilot exit:** The core list loop is stable, people return without prompting, group collaboration works, and support can resolve common issues.

## Gate 4 — Expand by validated demand

### Epic 7: Tasks and due dates

Add assignment, due dates, filters, activity events, and focused views after repeated user demand is observed.

### Epic 8: Reminders and notifications

Add in-product reminders first; add push/email only with explicit preferences, quiet hours, unsubscribe, delivery logs, and timezone correctness.

### Epic 9: Shared expense tracking

Add expense entry and split calculations after product/legal review. Start with manual settlement records only; do not process payments in this phase.

### Epic 10: Monetization

Test pricing and limits only after retention/value are demonstrated. Add plan comparison, checkout, receipts, cancel, refund, failed payment, downgrade, and entitlement synchronization as a separate project phase.

## Release checklist

- [ ] All critical user stories have acceptance criteria and an owner.
- [ ] No placeholder action appears as if it has succeeded.
- [ ] Server authorization, ownership transfer, and deletion are tested.
- [ ] Invite tokens are random, expiring, revocable, and redacted from logs.
- [ ] Data export, account deletion, privacy disclosure, and retention are defined.
- [ ] Forms preserve input after recoverable errors.
- [ ] Persian/RTL and English/LTR screenshots reviewed at mobile and desktop breakpoints.
- [ ] Keyboard-only navigation and accessible names verified.
- [ ] Analytics contains no list contents, invite tokens, email, or sensitive expense details.
- [ ] Error monitoring, backup/restore, and support escalation are ready.
- [ ] Rollback strategy exists for schema or release failures.
