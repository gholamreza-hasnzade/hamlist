# معماری اطلاعات و مدل دامنه

## ۱. نقشهٔ صفحات

```text
Public
├── Landing
├── Privacy / Terms / Help
├── Sign in / Create account
└── Invite preview

Authenticated application
├── Home / My day
│   ├── Due today
│   ├── Recent spaces
│   ├── Recent activity
│   └── Create / Join
├── Spaces
│   └── Space detail
│       ├── Overview
│       ├── Lists
│       │   └── List detail
│       ├── Tasks (after core validation)
│       ├── Reminders (phase 2)
│       ├── Shared expenses (phase 3)
│       ├── Members & invites
│       └── Space settings
├── My assigned items (phase 2)
├── Notifications
├── Search
└── Account settings
    ├── Profile, language, timezone
    ├── Notification preferences
    ├── Export data
    ├── Subscription (future)
    └── Delete account
```

## ۲. ناوبری پیشنهادی

**Desktop:**

- Sidebar: Home, My spaces, Assigned to me, Notifications; bottom Account/Help.
- Top bar: current space breadcrumb, search, create button, member avatars, profile.
- Main view: page content, filters, primary action.

**PWA mobile shell:**

- Bottom navigation: Home, Spaces, Inbox, Profile.
- Space detail uses a compact header and horizontal tabs or a single “More” menu.
- Primary add button reachable with one thumb; avoid desktop-style dense sidebar.
- Install affordance appears only when appropriate; once installed, use standalone display without a browser-chrome-dependent layout.
- Offline banner distinguishes “showing last synced data” from “changes waiting to sync”; cached data is cleared or scoped when the account changes.

**قاعدهٔ ناوبری:** کاربر همیشه بداند در کدام فضاست؛ space context persists through list/task screens. Back returns to previous meaningful screen, not always the app home.

## ۳. موجودیت‌های دامنه

### MVP entities

- **User**: `id`, `displayName`, `email`, `locale`, `timezone`, `createdAt`, `status`.
- **Session**: `id`, `userId`, `createdAt`, `expiresAt`, `revokedAt`.
- **Space**: `id`, `name`, `type` (`personal|group`), `ownerId`, `createdAt`, `archivedAt`, `deletedAt`.
- **Membership**: `spaceId`, `userId`, `role`, `joinedAt`, `leftAt`, `notificationLevel`.
- **Invite**: hashed `token`, `spaceId`, `createdBy`, `role`, `expiresAt`, `maxUses`, `uses`, `revokedAt`.
- **List**: `id`, `spaceId`, `name`, `templateKey`, `sortMode`, `createdBy`, `updatedAt`, `archivedAt`.
- **ListItem**: `id`, `listId`, `title`, `note`, `quantity`, `status`, optional `assigneeId`, optional `dueAt`, `createdBy`, `updatedBy`, `version`, timestamps.
- **ActivityEvent**: `id`, `spaceId`, `actorId`, `entityType`, `entityId`, `verb`, minimal `metadata`, `createdAt`.
- **Notification**: `id`, `recipientId`, `spaceId`, `type`, `entityId`, `readAt`, `createdAt`.

### Later entities

- **Reminder**: entity reference, `dueAt`, `timezone`, channels, `snoozedUntil`, state.
- **Expense**: amount in integer minor units, currency, payer, date, description, state.
- **ExpenseShare**: expense, user, amount in minor units, settlement state.
- **Subscription/Entitlement**: provider reference, plan, status, renewal, limits. Keep payment-provider details server-side.

## ۴. Permission matrix (initial proposal)

| Action | Owner | Member | Viewer (future) | Invite preview |
|---|---:|---:|---:|---:|
| View a joined space | Yes | Yes | Yes | No |
| View invite summary | N/A | N/A | N/A | Yes, limited |
| Add/edit list item | Yes | Yes | No | No |
| Complete/reopen item | Yes | Yes | No | No |
| Create/revoke invitations | Yes | Optional configurable | No | No |
| Remove member | Yes | No | No | No |
| Leave group | Yes, after transfer | Yes | Yes | No |
| Transfer ownership | Yes | No | No | No |
| Archive/delete space | Yes | No | No | No |

All authorization must be enforced server-side on every request; hiding a button is not permission enforcement.

## ۵. State model

### ListItem

```text
open ──complete──> done
  ^                  │
  └──reopen──────────┘

open|done ──archive list──> archived (hidden from active views, retained)
archived ──restore────────> open or previous state
```

### Invitation

```text
created → active → accepted
                  ↘ revoked
                  ↘ expired
                  ↘ exhausted (maxUses reached)
```

### Subscription (future)

```text
trial/active → cancel_at_period_end → expired
      └──────> past_due → active | expired
```

Store state transitions explicitly; do not infer paid access from client-side UI.

## ۶. Internationalization rules

- Locale options at launch: Persian (`fa`, RTL) and English (`en`, LTR).
- Use logical CSS properties (`margin-inline-start`, `padding-inline-end`) instead of left/right assumptions.
- Never build a localized sentence by concatenating translated fragments; use translation templates with parameters.
- Store timestamps as UTC; format using user locale and timezone.
- Store monetary values as integer minor units with ISO currency code; format with `Intl.NumberFormat`.
- Keep language selection independent from account region and billing currency.
- Test every screen at narrow mobile widths in both directions; mirroring only the text is insufficient.

## ۷. Search and filters

MVP: search list titles and item text within the current authorized spaces. Filters should include active/completed and optional assignee/due date when those fields exist. Search results must retain space/list context and never return inaccessible content.

## ۸. Empty, loading, error and confirmation states

Each main screen should define:

- Empty: why it is empty + one action to begin.
- Loading: skeleton with stable page geometry.
- Error: what failed + retry + whether unsaved input is preserved.
- Offline: local read state and explicit pending-write indicator, if offline writing is supported.
- Destructive confirmation: target name, impact, and undo/restore path if available.
