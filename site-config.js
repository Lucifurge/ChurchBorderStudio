/*
  CHURCH BORDER STUDIO WEBSITE CONFIGURATION
  --------------------------------------------------
  Default downloads are local files in ./downloads/.
  Upload the .exe files to that folder before publishing and the
  site will automatically enable the matching download buttons.

  If you host installers elsewhere (for example, on a release page),
  replace installerUrl / portableUrl with the full download URLs and
  set verifyLocalFiles to false.
*/
window.CBS_SITE_CONFIG = {
  version: "16.0.0",
  installerUrl: "downloads/Church-Border-Studio-Setup-16.0.0.exe",
  portableUrl: "downloads/Church-Border-Studio-Portable-16.0.0.exe",
  verifyLocalFiles: true,
  releaseDate: "October 2026",
  publisher: "Rhapnel Reys Developments",
  // Set this after deploying the licensing API; never place PayMongo secret keys here.
  licenseApiUrl: "https://YOUR-LICENSING-API.onrender.com",
  proPricePHP: 499
};
