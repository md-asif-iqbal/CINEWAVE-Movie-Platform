# CineWave Database Seeder

Automated seeding system that fetches **real content data** from TMDB, downloads all images, uploads them to **your Cloudinary account**, and saves everything to MongoDB.

---

## Setup (3 steps)

1. **Add TMDB API key** to `.env.local`:
   ```
   TMDB_API_KEY=your_tmdb_api_key_here
   ```
   Get a free key at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)

2. **Ensure MongoDB + Cloudinary** keys are in `.env.local` (should already be configured)

3. **Run the seeder:**
   ```bash
   npm run seed
   ```

---

## What happens automatically

- Connects to your existing MongoDB (same config as `lib/db.js`)
- Connects to your existing Cloudinary (same config as `lib/cloudinary.js`)
- Fetches **23 series** + **10 movies** from TMDB API
- Downloads **all** posters, backdrops, episode thumbnails, and cast photos
- Uploads **all** images to your Cloudinary account (`cinewave/` folder)
- Saves everything to MongoDB with **Cloudinary URLs** (not TMDB URLs)
- Creates 3 demo user accounts
- Marks select titles as featured/trending
- **Skips** content already in DB (idempotent — safe to run multiple times)
- Takes **~15–25 minutes** on first run (due to image uploads)

---

## Demo Accounts

| Email                   | Password  | Role  | Status          |
|-------------------------|-----------|-------|-----------------|
| admin@cinewave.com      | Admin@123 | Admin | Full access     |
| test@cinewave.com       | Test@123  | User  | Trial active    |
| expired@cinewave.com    | Test@123  | User  | Trial expired   |

---

## Commands

| Command               | Description                              |
|-----------------------|------------------------------------------|
| `npm run seed`        | Seed database (skips if already done)    |
| `npm run seed:force`  | Force re-seed everything                 |
| `npm run seed:clear`  | Wipe content + episodes from DB          |
| `npm run seed:users`  | Seed only demo users                     |

---

## Content Seeded

### Korean Dramas (10)
Squid Game, Crash Landing on You, Itaewon Class, My Love from the Star, Descendants of the Sun, Goblin, Hospital Playlist, Reply 1988, Vincenzo, Business Proposal

### Turkish Dramas (2)
Dirilis Ertugrul, Kurulus Osman

### Hindi Series (6)
Mirzapur, Sacred Games, Panchayat, Scam 1992, Delhi Crime, TVF Pitchers

### International Series (5)
Breaking Bad, Game of Thrones, Money Heist, Dark, Stranger Things

### Movies (10)
Parasite, The Dark Knight, Inception, Interstellar, 3 Idiots, Dangal, Avengers Endgame, Spider-Man No Way Home, The Shawshank Redemption, Forrest Gump

---

## File Structure

```
scripts/
├── seed.js                      ← Main runner (auto-skip logic)
├── seedContent.js               ← TMDB fetch + Cloudinary upload + MongoDB save
├── seedUsers.js                 ← Demo users with bcrypt passwords
├── clearDB.js                   ← Wipe content collections
├── README.md                    ← This file
├── helpers/
│   ├── fetchTMDB.js             ← TMDB API calls
│   ├── uploadToCloudinary.js    ← Download buffer + upload to Cloudinary
│   └── trailerMap.js            ← YouTube trailer video IDs
└── data/
    ├── koreanDramas.js          ← TMDB IDs for Korean dramas
    ├── turkishDramas.js         ← TMDB IDs for Turkish dramas
    ├── hindiSeries.js           ← TMDB IDs for Hindi series
    ├── international.js         ← TMDB IDs for international series
    └── movies.js                ← TMDB IDs for movies
```

---

## Notes

- **Video URLs** are sample MP4s for demo purposes — upload real videos via the admin panel
- **Trailers** are YouTube embeds (free, no download needed)
- **All images** are permanently stored on YOUR Cloudinary account under `cinewave/`
- Re-running `npm run seed` **never creates duplicates** (uses MongoDB upsert + Cloudinary duplicate check)
- Cloudinary images are organized in folders: `posters/`, `backdrops/`, `cast/`, `season-posters/`, `episode-thumbs/`
- Series seasons are capped at 5 to keep initial seeding fast
