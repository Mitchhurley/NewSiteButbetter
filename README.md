# Joseph Hurley Architects — website

A static site for Joseph Hurley Architects, restored from the Internet Archive
(the original live site is gone) and cleaned up for redeployment.

The deployable site lives in [`cleaned_site/`](cleaned_site/). It's plain HTML/CSS/JS —
no build step.

## Structure

```
cleaned_site/
  index.html          Home (splash) — home.html redirects here
  projects.html       Projects listing (defaults to the 44th Street House gallery)
  profile.html        Firm profile
  publications.html   Press / publications
  contact.html        Contact details
  projects/           One page per project (12), each with a photo gallery
  css/                Stylesheets (fixes.css is the authoritative/responsive layer)
  js/gallery.js       Vanilla-JS gallery (thumbnail -> main image swap)
  images/             Photos: project_image/ (full), thumb_project_image[_bw]/ (thumbs)
local_server.py       Local preview server
.github/workflows/    GitHub Pages deploy workflow
```

## Run locally

```bash
python local_server.py            # serves ./cleaned_site at http://localhost:8000
python local_server.py --no-browser
```

## Deploy (GitHub Pages)

1. Push this repo to GitHub (branch `main`).
2. In the repo: **Settings → Pages → Build and deployment → Source: “GitHub Actions.”**
3. Every push to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
   which publishes `cleaned_site/`. The live URL appears in the workflow run and under Settings → Pages.

A custom domain (e.g. `josephhurleyarchitects.com`) can be added later under Settings → Pages.

## Known open items

- **CV PDF** (profile page) and the **AIA Seattle Times PDF** (publications) were not in the
  archive. The profile page has a commented-out placeholder — drop `userfiles/CV.pdf` into
  `cleaned_site/` and restore the link to re-enable it.
- Filenames mix `.jpg` and `.JPG`. GitHub Pages is case-sensitive, so keep references matching
  the on-disk case exactly (verified at time of restore).
