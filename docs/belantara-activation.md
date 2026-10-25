# Belantara activation

The owner confirmed database package ID **10** and rental price **RM200**.
The frontend now enables checkout through the same package-detail API flow as
other packages, with RM200 as the fallback price and RM100 as the deposit.
Belantara is included in the availability list and booked-calendar mapping.

Production frontend build passed.

## Outstanding backend work

The inspected sibling backend still assigns RM100 deposits only to Rimbayu and
Gelora; Belantara currently falls back to RM50. Add `BELANTARA: "Belantara"` to
`constants/packageConstants.js` and include `PACKAGE_NAMES.BELANTARA` in the
RM100 condition in `services/bookingService.js`. Permission to edit that folder
was declined, so these backend files have not been changed.

Permission to query the live package API was also declined. The deployed
record for ID 10 and its price have not been independently verified. The shared
frontend flow reads the API price when present, so the database must also hold
RM200. No database records or real bookings were created or changed.

Before release, apply the backend deposit fix and verify package detail,
blocked dates, availability, and payment totals without creating a paid booking.
Booking-only deposit should be RM100; one-night walk-in should be RM300 before
add-ons and existing payment fees. Frontend changes have not been deployed.
