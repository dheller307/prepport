# Slice 5 — React: portion builder + export UI

**Status:** Not started · **Next after:** [slice 4](./slice-4.md)

**Target:** Jul 28–29 (ship with slice 4) · Complete **product MVP** local flow with slice 2 APIs.

## Done when

- [ ] **Portion builder** — add lines (batch + cooked grams); call `POST /api/portion/calculate` for live macros per line or meal totals
- [ ] **Export panel** — build `PortionExportRequest` lines; `POST /api/portion/export`; display `text/plain`; **copy to clipboard**
- [ ] Chicken check in UI: 200 g cooked from 2146/1600 batch → **≈268 g** `cronometerG` on calculate response
- [ ] Works on a phone-width viewport (Sunday at scale)

## APIs

```
POST   /api/portion/calculate    → JSON PortionCalculateResponse
POST   /api/portion/export       → text/plain body
```

See [slice-2](./slice-2.md) and [requests.http](../../requests.http).

## Not in scope

- CSV export, meal templates, deploy
