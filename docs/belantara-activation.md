# Belantara activation

The frontend package and booking preview are ready. Checkout is intentionally
disabled in `src/data/belantaraPackage.js` until the real database ID and backend
deposit rule are confirmed. The user deferred providing the ID; no live API,
database or backend code was changed.

- Rental price: RM200, from the supplied price-list poster.
- Deposit: RM100, explicitly provided by the user.
- Brand/model: PAYUNG.CAMP Village L+.
- Size: 360 × 260 × 195 cm; weight: 19.7 kg.
- Type: 2 Bedrooms; setup: Automatic.
- One company product image plus four supplied detail photos are optimized and
  connected to the homepage carousel and booking preview. No I1/I2/I3 placeholders
  or invented manufacturer photos are used.

To enable checkout:

1. Confirm/create the `Belantara` record in the backend `package` table with the
   correct rental price, and use its actual ID (do not assume a sequential ID).
2. Add Belantara to the backend RM100 deposit rule. The inspected backend currently
   assigns RM100 only when the package name is Rimbayu or Gelora; other tent names
   fall back to RM50. This would otherwise reject the frontend total.
3. Verify the package-detail, blocked-date, availability and final-payment paths
   using the actual record. Include Belantara in the frontend availability list
   once the API supplies its availability.
4. Set `packageId` and `checkoutReady: true` in `src/data/belantaraPackage.js`.
5. Verify booking-only payment is RM100 and one-night walk-in total is RM300 before
   add-ons and any existing payment fees, with the backend validating the same
   values. Do not create a real paid booking just to test.
