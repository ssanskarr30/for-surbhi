For Surbhi 💖 — PWA Website
================================

Open on any phone (Android or iPhone) and tap **Add to Home Screen** to install like an app.
Works offline for the core pages once loaded.

Features
- Home: apology note, confetti, floating hearts, compliment generator, theme toggle
- Music: paste direct MP3 link or open “Perfect” on Spotify/YouTube
- Hydration: browser notifications every 1h/3h/6h/daily + daily water log
- Timetable: pre-filled weekly schedule (as you provided)
- Attendance: per-class (Present/Absent/Holiday), daily & overall % (excludes Lunch/Free/Holidays)
- Gallery: upload or camera capture; stays on device (not uploaded)
- Playlists: Seedhe Maut, Taylor Swift, English mixes
- Fitness: basic step estimate via motion sensor (if supported) + manual pulse entry
- PWA: manifest + service worker + install prompt

How to run locally
1) Unzip the folder.
2) Double-click `index.html` to open in your browser.
   - For full PWA + notifications, use a simple local server:
     - Python: `python -m http.server 5173`
     - Node: `npx serve .`
3) Visit `http://localhost:5173` (or the URL shown).

Deploy (free & fast)
- **Netlify Drop**: drag the folder → instant URL.
- **Vercel**: `vercel` in the folder (or upload).
- **GitHub Pages**: new repo → upload → Settings → Pages → Deploy from main.

Enable notifications (Hydration)
- Click **Enable Notifications** in the Hydration tab and allow the prompt.
- Choose interval and click **Start**. The site also shows an in-page alert if notifications are blocked.

Notes
- iOS may throttle background notifications; keeping the page open works best. PWA install improves behavior.
- “Perfect” (Ed Sheeran) is copyrighted; the app cannot embed it. Use Spotify/YouTube buttons or your own hosted MP3 link.
- Photos are kept via Object URLs and your browser storage; clearing site data will remove them.
