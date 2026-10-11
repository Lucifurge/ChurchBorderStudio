# Church Border Studio — Website Deployment Guide

This is a static, dependency-free product website for Church Border Studio Production Edition v16.0.0.

## Included
- Responsive landing page with feature sections, product visual, compatibility notes, FAQ, and download panel
- Privacy and release notes pages
- Branded app icon, logo, loading art, and stage preview asset
- Local download button checks (buttons stay disabled until the configured executable is available)
- No JavaScript framework, build step, tracking pixel, analytics package, or external font dependency

## Publish with direct files
1. From the Windows build's `dist` folder, copy `Church-Border-Studio-Setup-16.0.0.exe` into `downloads/`.
2. Optionally copy `Church-Border-Studio-Portable-16.0.0.exe` into `downloads/`.
3. Upload the whole `Church_Border_Studio_Website` folder contents to your static host's web root. Keep the folder structure intact.
4. Visit the deployed HTTPS URL and test both download buttons, the mobile nav, FAQ accordions, privacy page, and release notes.

## Hosting the installers separately (recommended for a ~113 MB file)
Some static site hosts have per-file or per-deploy size limits. For a large installer, upload the EXE files to a release asset service such as GitHub Releases or another reliable file host, then edit `site-config.js`:

```js
window.CBS_SITE_CONFIG = {
  version: "16.0.0",
  installerUrl: "https://YOUR-DIRECT-INSTALLER-URL.exe",
  portableUrl: "https://YOUR-DIRECT-PORTABLE-URL.exe",
  verifyLocalFiles: false,
  releaseDate: "October 2026",
  publisher: "Rhapnel Reys Developments"
};
```

Use direct asset URLs that cause the browser to download the EXE, not a web page that requires an extra click. The example URLs above are placeholders and must be replaced before publishing.

## Local preview
Run a local static server from this folder, for example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in a browser. The download buttons remain unavailable until the configured EXE files are added. This is intentional; it avoids shipping broken download links.

## Accessibility and production checklist
- Keep headings in order and meaningful alt text on product imagery.
- Test at 375 px mobile width, tablet width, and desktop width.
- Serve the site over HTTPS.
- Confirm download hashes after upload and keep release filenames versioned.
- Code-sign Windows installers if possible; this reduces uncertainty about publisher identity but is not a replacement for careful release hygiene.
- Confirm the license, privacy contact, and support channel before public promotion. The app metadata currently states `UNLICENSED`, so do not claim that the software is open source or grant rights not yet defined.
- The product UI artwork used in the website is an illustrative marketing concept; do not label it as a literal screenshot of the running desktop application. The central worship-stage visualization is also a sample scene.
