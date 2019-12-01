module.exports = {
  "globDirectory": "src/",
  "globPatterns": [
    "**/*.{html,css,js,jpg,svg}", //we need to change this base on that we want to cache on each project
    "assets/imgs/*.{jpg,png}"
  ],
  "globIgnores": [
    "about.html"
  ],
  "swSrc": "src/swWorkboxInit.js",
  "swDest": "src/sw(workbox).js"
};