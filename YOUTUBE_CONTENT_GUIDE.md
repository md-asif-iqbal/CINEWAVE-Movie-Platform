# CineWave — YouTube Content Guide (Admin Panel)

## How to Add Series/Movies with YouTube Videos

CineWave supports playing videos from **YouTube** (unlisted) directly in the platform.
No Cloudinary or file upload needed for videos — just paste YouTube URLs.

---

## Step 1: Make YouTube Videos "Unlisted"

> ⚠️ **This is required!** Private videos CANNOT be embedded. Only Unlisted or Public videos work.

1. Go to [YouTube Studio](https://studio.youtube.com)
2. Click **Content** in the left sidebar
3. Select each video you want to use
4. Click the **Visibility** dropdown → Change from **Private** to **Unlisted**
5. Save

**Unlisted** means:
- ✅ Can be embedded and played on your website
- ✅ Won't appear in YouTube search or your public channel
- ✅ Only people with the link (or your website) can watch

---

## Step 2: Add a Series from Admin Panel

### 2a. Create the Series (Content)

1. Go to your website → `/admin/content`
2. Click **"Add New"**
3. Fill in:
   - **Title**: e.g. "Tehran"
   - **Type**: Select **"series"**
   - **Description**: Series description
   - **Genre**: Select applicable genres
   - **Thumbnail Image**: Paste a poster image URL (e.g. from TMDB: `https://image.tmdb.org/t/p/w500/...`)
   - **Backdrop Image**: Paste a backdrop image URL
   - **Trailer Video**: Paste a YouTube URL (e.g. `https://youtu.be/smMkkOTm1_A`)
   - **Main Video**: Same as trailer, or leave empty for series
   - Other fields as needed (year, cast, tags, etc.)
4. Click **"Create Content"**

### 2b. Add Episodes

After creating the series:

1. Go to **Admin → Content** → Find your series → Click **Edit**
2. Scroll down to the **"Episodes"** section
3. Click **"Add Episode"**
4. Fill in:
   - **Season**: 1, 2, etc.
   - **Episode**: 1, 2, 3, etc.
   - **Title**: Episode title (e.g. "The Recruit")
   - **Video URL**: Paste the YouTube URL for this episode
     - Supported formats:
       - `https://youtu.be/smMkkOTm1_A`
       - `https://www.youtube.com/watch?v=smMkkOTm1_A`
       - `https://www.youtube.com/embed/smMkkOTm1_A`
     - The system auto-converts to embed format
   - **Thumbnail**: Auto-filled from YouTube! (or paste a custom URL)
   - **Description**: Episode description (optional)
   - **Duration**: Episode duration in minutes
5. Click **"Save Episode"**
6. Repeat for each episode

> 💡 **Tip**: After saving an episode, the Season and Episode numbers auto-increment so you can quickly add the next one.

---

## Step 3: Add a Movie from Admin Panel

1. Go to `/admin/content` → **"Add New"**
2. Set **Type** to **"movie"**
3. Fill in title, description, genre, etc.
4. In **"Main Video File"** field, paste your YouTube URL
5. In **"Trailer Video"** field, paste a trailer YouTube URL (can be the same)
6. For images, paste TMDB or any image URLs directly (no upload needed)
7. Click **"Create Content"**

---

## Where to Get Image URLs (Free, No Upload)

You don't need Cloudinary for images. Use these sources:

### TMDB (The Movie Database)
- Go to [themoviedb.org](https://www.themoviedb.org)
- Search for your movie/series
- Right-click on the poster/backdrop → Copy image URL
- Or use the pattern: `https://image.tmdb.org/t/p/w500/<path>`

### YouTube Thumbnails (Auto-Generated)
- Every YouTube video has auto-generated thumbnails
- Pattern: `https://i.ytimg.com/vi/<VIDEO_ID>/hqdefault.jpg`
- For higher quality: `https://i.ytimg.com/vi/<VIDEO_ID>/maxresdefault.jpg`
- Example: `https://i.ytimg.com/vi/smMkkOTm1_A/hqdefault.jpg`

---

## Using the Seed Script (Alternative)

For bulk-adding content, use the seed script instead of the admin panel:

```bash
# Seed Tehran series (pre-configured)
npm run seed:tehran

# The script at scripts/seedTehran.js has all data hardcoded
# Edit the EPISODES array to add/remove episodes
```

### Adding New Videos to the Seed Script

1. Open `scripts/seedTehran.js`
2. Add entries to the `EPISODES` array:
   ```js
   const EPISODES = [
     // Season 1
     { season: 1, episode: 1, youtubeId: 'YOUR_VIDEO_ID' },
     { season: 1, episode: 2, youtubeId: 'GVj8ScxeIAM' },
     // ... more episodes
     
     // Season 2
     { season: 2, episode: 1, youtubeId: 'smMkkOTm1_A' },
     // ... more episodes
   ];
   ```
3. Run: `npm run seed:tehran`

### How to Get YouTube Video ID

From any YouTube URL, the ID is the 11-character string:
- `https://youtu.be/smMkkOTm1_A` → ID: `smMkkOTm1_A`
- `https://youtube.com/watch?v=smMkkOTm1_A` → ID: `smMkkOTm1_A`

---

## How Video Playback Works

The video player (`components/content/VideoPlayer.jsx`) automatically detects the URL type:

| URL Type | Behavior |
|---|---|
| YouTube URL (`youtube.com/embed/...`, `youtu.be/...`) | Plays via YouTube iframe embed |
| Direct URL (`.mp4`, Cloudinary, etc.) | Plays via HTML5 `<video>` element |
| No URL | Shows "Video coming soon" placeholder |

No code changes needed — just paste the right URL and it works.

---

## Troubleshooting

### "Video unavailable" in player
→ Your YouTube video is set to **Private**. Change it to **Unlisted** in YouTube Studio.

### Thumbnail not showing
→ The system auto-generates thumbnail from YouTube. If it's not working, manually paste: `https://i.ytimg.com/vi/VIDEO_ID/hqdefault.jpg`

### Episodes not showing on watch page
→ Make sure:
1. The content type is set to **"series"**
2. Episodes have the correct `contentId`, `season`, and `episode` numbers
3. Content status is **"active"**

### Can't see the "Episodes" section in admin edit page
→ The Episodes section only appears when:
1. The content type is **"series"**
2. You've **saved** the content first (episodes need a content ID to link to)
3. You're on the **Edit** page (not the Create page)

---

## Quick Reference

| Task | Where | Action |
|---|---|---|
| Add series | Admin → Content → Add New | Type = "series", fill details, save |
| Add episodes | Admin → Content → Edit Series | Scroll to Episodes → Add Episode |
| Add movie | Admin → Content → Add New | Type = "movie", paste YouTube URL in Video field |
| Change video URL | Admin → Content → Edit → Episodes | Click edit icon on episode |
| Bulk add | Terminal | Edit `scripts/seedTehran.js` → `npm run seed:tehran` |
