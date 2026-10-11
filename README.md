# Halloween RSVP — Firebase + GitHub Pages

1. Open `firebase.js`. Replace all `XXXX` placeholder values with your real Firebase **web app** configuration from Firebase Console > Project settings > General > Your apps > Config. Do not use service account credentials.
2. In Firestore, use the `(default)` database and `rsvps` collection. Each document has `name` (string), `status` (string: `yes`, `no`, `maybe`), `plusOnes` (integer). Your existing Dorothy test record should appear.
3. In Firestore > Rules, publish the validated rules from your conversation. Public creation is still vulnerable to spam; use App Check and additional abuse protection for wider sharing.
4. For local testing, use a local HTTP server rather than opening `index.html` with `file://`. For example in the project folder run `python3 -m http.server 8000`, then open `http://localhost:8000`.
5. Upload `index.html`, `style.css`, `script.js`, and `firebase.js` to a public GitHub repository. Go to Settings > Pages > Deploy from a branch > main > /(root). Wait for the Pages URL.
6. If using Firebase Authentication or App Check, configure your deployed GitHub Pages domain as required by those products. Firestore access is controlled by Firestore Rules, not by the web config API key.

Note: The current guest list is public and guests cannot edit or delete their RSVPs. Names are not verified and duplicate submissions are possible.
