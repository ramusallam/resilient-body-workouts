# Resilient Body — Workout Display

Live display app that reads a Google Sheet of training-session workouts and renders it in the Resilient Body aesthetic (charcoal + cream + gold). Edit the sheet during a session — the app reflects changes within ~5s.

**Live:** https://resilient-body-workouts.vercel.app

**Sheet:** April Workouts (must be share-link viewable by anyone)

## How it works

- Single-file `index.html` (Tailwind via CDN, no build step).
- Polls the sheet's public `gviz/tq?tqx=out:json` endpoint every 5s.
- Detects `WARM-UP`, `STRENGTH BLOCK`, `FINISHER` section banners by content.
- Each strength block renders as a clean grid: movement on the left, one column per client (Sheila / Jason / Emily V / Alix...).

## Edit the data

Just edit the Google Sheet. No app changes needed.

## Edit the design

Edit `index.html` → `vercel --prod` → `git push`.

## Deploy

```sh
vercel --prod
git push
```
