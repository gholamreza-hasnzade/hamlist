# Decision Log

This log separates confirmed direction from unresolved implementation choices.

## Confirmed for this planning round

| Topic | Decision |
|---|---|
| Working product name | هم‌لیست / HamList |
| Audience | Broad: the product should be usable by different kinds of people, not only one household segment. |
| Product map | Consider all the discussed areas: shared lists, task coordination, reminders, and expense tracking. |
| Release strategy | Include all areas in the product vision, but phase delivery so the first release is not overloaded. |
| Implementation sequence | User wants to start with the frontend/UI and defer real backend, auth, database and synchronization. The frontend must label mock flows honestly and stay backend-adapter-ready. |
| Initial platform | Installable, mobile-first PWA; responsive desktop web is also supported. Separate native apps are not part of the first release. |
| Visual direction | Editorial mobile UI inspired by the user's references: clean white canvas, subtle cool lavender atmosphere, ink surfaces, layered cards and a dark floating mobile navigation capsule. |
| Color themes | Offer light and dark modes. Light mode uses white surfaces with violet as the primary accent; dark mode uses midnight indigo/slate surfaces with cool violet and periwinkle accents. Avoid beige/brown in either theme. |
| Persian typography | Bundle the Vazir-family font locally for predictable Persian rendering without a CDN dependency; include its OFL license. |
| Initial languages | Persian and English. |

## Recommended, not yet approved

- Lead the MVP with a shared list and invitation loop; it is the smallest way to test repeat group use.
- Start with private-by-default spaces.
- Use tasks/assignment as the next expansion, reminders after the core list loop, and expenses only after legal/product review.
- Keep MVP free while value and retention are tested; do not add ads or payments before evidence.
- Treat installability as a product requirement; add offline writes only after sync, conflict resolution, and account-scoped cache behavior are specified and tested.

## Open decisions before production implementation

1. Which country/region is the first launch market? This affects privacy, authentication, email delivery, payment, and support.
2. Which authentication method is acceptable: email magic link/OTP, password, or social login?
3. Should a person be able to create a persistent list before creating an account?
4. Which notification channel is required at launch: in-app only, email, browser push, or a combination?
5. What is the initial limit for spaces, lists, members, and history (if any)?
6. Is monetization a subscription, a one-time purchase, organizational plans, or still unknown?
7. Who can invite/remove members and transfer space ownership?
8. What retention, export, and account deletion policy should apply?

These decisions are intentionally not invented in the wireframe. The prototype uses clearly labeled sample data and does not imply that authentication, invitations, syncing, notifications, or payments are implemented.
