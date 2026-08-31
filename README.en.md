# Bobbi Career Consultation Booking Demo

[中文](README.md) | [English](README.en.md)

This is a high-fidelity product demo for a career consultation business. It brings mentor discovery, availability selection, résumé and question submission, meeting details, and booking management into one clear online flow.

The project is currently intended for product communication and concept validation. It does not process real payments, upload personal files, create meetings, send notifications, or issue refunds.

## Live Demo

- [Full product prototype](https://bobbi-career-demo.vercel.app/prototype/index.html#/student-home)
- [Product introduction for Bobby](https://bobbi-demo-portal.vercel.app)

The full prototype contains three entry points:

- Book a consultation: search profiles, review details, choose a time, submit consultation materials, and manage bookings.
- Provide consultations: review upcoming sessions, check profile status, and submit personal information.
- Bobby admin: manage profiles, availability, orders, meeting details, refund records, and operating data.

## Current Scope

- 27 high-fidelity product pages
- 10 structured career profile samples
- Search by submission number, education background, industry, and role
- Explainable ranking based on tag matching, keyword hits, and availability
- Desktop prototype workspace with mobile page previews
- A standalone HTML product presentation
- Automatic Vercel deployments after pushes to the GitHub `main` branch

## Repository Structure

```text
prototype/              Source of truth for the current product prototype
bobbi-portal/           Standalone HTML product presentation
share-site/public/      Vercel publishing snapshot of the prototype
demo/                   Earlier demo implementation and structured sample data
memory-bank/            Product, architecture, technology, and delivery documents
```

`prototype/` is the design and interaction baseline. After changing it, the publishing snapshot under `share-site/public/prototype/` must also be updated.

## Local Preview

Both deliverables are static websites. You can open their `index.html` files directly or serve the repository with any local static file server.

Run the following checks after making changes:

```bash
node prototype/tests/render-check.mjs
node bobbi-portal/tests/check.mjs
node demo/tests/check.mjs
node share-site/tests/public-entry.test.mjs
```

## Two Product Tracks

The repository preserves two separate product tracks:

- High-fidelity communication demo: the current interactive experience, used to align with Bobby on the business flow and product direction.
- Production plan: the product and implementation documents under `memory-bank/`. It can proceed after the required business entity, WeChat Mini Program, WeChat Pay, domain, and external service accounts are ready.

The completeness of the demo interface does not imply that production capabilities have been implemented.

## Data and Usage Notice

The sample profiles were structured from publicly posted material supplied by the project owner. They are included only for product validation and portfolio presentation. The repository does not contain user résumés, verification documents, payment information, or real order data.

No open-source license is currently provided. Do not reuse the profile data, product documents, or visual assets in another commercial project without permission.
