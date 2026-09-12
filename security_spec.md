# Security Specification & Payload Invariants

## Data Invariants
1. `config/ministryConfig` holds the global website configuration (banners, executive photo, themes, sermons). Anyone can read it so the site functions worldwide; write requires valid schema.
2. `bookings` collection allows visitors to submit ministration bookings. Valid fields (fullName, email, phone) required.
3. `prayer_requests` collection allows visitors to send confidential prayer requests to Pastor Best Eghosa.

## Tested Rules
- Public read access on `config/*`
- Public write access on `bookings/*` and `prayer_requests/*` for form submissions
- Default deny on all unspecified paths
