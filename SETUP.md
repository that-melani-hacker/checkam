# CheckAm starter kit

## 1. Create the project
npx create-next-app@latest checkam --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*"
cd checkam
npm i zod

## 2. Copy this kit in
Copy every folder and file from this kit into the project root, replacing the generated
app/layout.tsx, app/page.tsx and app/globals.css. Copy .env.example to .env.local.

## 3. Check it runs
npm run dev, then open:
- /result?mock=mismatch (try no_red_flags, not_found, expired, unreadable)
- /report?mock=mismatch
- add &lang=pcm to switch to Pidgin

## 4. Push and deploy
Push to GitHub, add Fortunatus, Vivian and Albert, then import the repo into Vercel.

## Who fills what
Search the project for "TODO(" plus your name. Every stub already has its exact
signature from the Functions document. Shared files (lib/types.ts, lib/mock, lib/state)
are done: change them only after agreeing with Fortunatus and Melani.

Branches: feat/result (Melani), feat/api (Fortunatus), feat/scan (Vivian), feat/home (Albert).
