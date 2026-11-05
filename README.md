# Movie date :)

A tiny, intentionally homemade date invitation. Red background, a face that steals the No button, and a reaction-photo reveal with a taped movie note.

## Open it now

Double-click **index.html**. It is the complete website: both photos, JavaScript, styling, and the calendar download are embedded. It works offline; no installation or server is required.

## Publish on GitHub Pages

This folder is ready for a new repository. No GitHub account name, token, remote, or existing repository is included.

1. Create a new, empty repository on GitHub, for example `movie-date`. Do not initialize it with a README. GitHub Free supports Pages from public repositories; using a private repository requires an eligible paid plan.
2. Open a terminal in this extracted `movie-date-github` folder and run the commands below, replacing `YOUR-USERNAME` with your own GitHub username.
3. In the GitHub repository, open **Settings → Pages → Build and deployment → Source** and select **GitHub Actions**.
4. Open **Actions → Publish movie date → Run workflow** and choose `main`. If the initial push ran before Pages was enabled and failed, run it again after step 3.
5. Once the workflow succeeds, its deployment link opens the website. Later pushes to `main` publish updates automatically.

```sh
git init -b main
git add .
git commit -m "Add movie date invitation"
git remote add origin https://github.com/YOUR-USERNAME/movie-date.git
git push -u origin main
```

Use the remote URL GitHub shows you if you choose a different repository name. Git may prompt you to sign in through your normal GitHub authentication method. You do not need to add any custom deployment secrets: the workflow uses GitHub's built-in token.

The normal GitHub Pages URL will be `https://YOUR-USERNAME.github.io/movie-date/`.

**Visibility:** ordinary GitHub Pages hosting is public, and this package contains both personal photos. A public repository also makes the source and images public. This package has only been prepared locally; nothing has been uploaded or deployed.

GitHub's workflow documentation: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

## What is included

- `index.html`: ready-to-open, self-contained website and the Pages entry point.
- `src/`: editable HTML, CSS, JavaScript, two photos, and calendar file.
- `build.py`: standard-library-only Python builder; rebuilds `index.html` from `src`.
- `.github/workflows/pages.yml`: builds and publishes on pushes to `main`, or on manual runs.
- `.nojekyll`: treats the website as ordinary static HTML.
- `.gitignore` and `.gitattributes`: repository housekeeping.

Only `index.html` and `.nojekyll` are included in the deployed Pages artifact. Source files and setup instructions stay out of the website artifact, although they remain visible in a public repository.

## Make changes

Edit the files in `src/`, then run:

```sh
python3 build.py
```

Open `index.html` again to preview. Commit both your source changes and the rebuilt page when ready. GitHub Actions also rebuilds from source before deploying.

## Current experience

- The real mouse cursor is untouched. Approaching No makes the face grab it and pull it to another corner. No remains visible and Yes stays in place.
- Clicking/tapping No or activating it with the keyboard also triggers the gag.
- Yes reveals her photo with the separate heading `never doubted you :)` and the line `wow you picked yes all by yourself`.
- A yellow note says `we’re watching Before Sunrise` — **Saturday, November 7, 2026 at 3 PM EST**.
- The calendar download uses **20:00 UTC**, equivalent to 3 PM EST. Update `src/index.html` and `src/movie-date.ics` together if the plan changes.
- Replay resets the interaction. Reduced-motion settings are respected.
- No analytics, external fonts, accounts, or data collection are included.

The speech bubbles, in order:

1. nope. mine now.
2. you saw nothing.
3. bro stawpp
4. stop being meannn
5. stop chasing my button
6. i'm going to remember this

The final line repeats on subsequent attempts.
