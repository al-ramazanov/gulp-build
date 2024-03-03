const { src, dest, watch, parallel, series } = require("gulp");

const replace = require("gulp-replace");

const changed = require("gulp-changed");

const browserSync = require("browser-sync").create();

const clear = require("gulp-clean");

const fs = require("fs");

const plumber = require("gulp-plumber");

const notify = require("gulp-notify");

const webpack = require("webpack-stream");

const babel = require("gulp-babel");

// Html

const fileInclude = require("gulp-file-include");

const webPHtml = require("gulp-webp-html");

const htmlclean = require("gulp-htmlclean");

// Html
// ============
// Styles

const webPCss = require("gulp-webp-css");

const sass = require("gulp-sass")(require("sass"));

const autoprefixer = require("gulp-autoprefixer");

const csso = require("gulp-csso");

const sassGlob = require("gulp-sass-glob");

const groupMedia = require("gulp-group-css-media-queries");

const sourceMaps = require("gulp-sourcemaps");

// Styles
// ============
// Images
const imageMin = require("gulp-imagemin");

const webp = require("gulp-webp");

const sprite = require("gulp-svg-sprite");

// Images
// ============

function clearDist(done) {
  if (fs.existsSync("./dist/")) {
    return src("./dist/", { read: false }).pipe(clear());
  }
  done();
}

const plumberNotify = (title) => {
  return {
    errorHandler: notify.onError({
      title: title,
      message: "Error: <%=error.message%>",
      sound: false,
    }),
  };
};

// работаем с html

function html() {
  return src("app/**.html")
    .pipe(plumber(plumberNotify("Html")))
    .pipe(
      fileInclude({
        prefix: "@@",
      })
    )
    .pipe(replace(/@images\//g, "images/"))
    .pipe(replace(/@js\//g, "js/"))
    .pipe(dest("./dist"));
}

// работаем с html

// ==================================================

// работаем со стилями

function styles() {
  return src("./app/scss/*.scss")
    .pipe(changed("./dist/css/"))
    .pipe(plumber(plumberNotify("Styles")))
    .pipe(sourceMaps.init())
    .pipe(sassGlob())
    .pipe(replace(/@images\//g, "../images/"))
    .pipe(dest("dist/scss"))
    .pipe(sass())
    .pipe(sourceMaps.write())
    .pipe(dest("./dist/css/"))
    .pipe(browserSync.stream());
}

// работаем со стилями
// ==================================================
// работаем с изображениями

function images() {
  return src("./app/images/**/*")
    .pipe(changed("./dist/images/", { hasChanged: changed.compareContents }))
    .pipe(plumber(plumberNotify("Images")))
    .pipe(imageMin({ verbose: true }))
    .pipe(dest("./dist/images/"))
    .pipe(browserSync.stream());
}

function svgSprite() {
  return src("./dist/images/*.svg")
    .pipe(
      sprite({
        mode: {
          symbol: {
            sprite: "../svg/icons.svg",
          },
        },
        shape: {
          transform: [
            {
              svgo: {
                plugins: [
                  {
                    name: "removeAttrs",
                    params: {
                      attrs: ["stroke", "fill"],
                    },
                  },
                ],
              },
            },
          ],
        },
      })
    )
    .pipe(dest("./dist/images/"));
}

// работаем с изображениями
// ==================================================

function browsersync() {
  browserSync.init({
    server: {
      baseDir: "dist/",
      // index: 'about.html',
    },
    notify: false,
  });
}
function watcher() {
  watch(["./app/scss/**/*.scss"], styles);
  watch(["./app/images/**/*"], images);
  watch(["./app/js/**/*.js"], scripts);
  // watch(["./app/**/*.html"], html).on("change", browserSync.reload);
  watch(["app/**/*.html"], html).on("change", browserSync.reload);
}

function scripts() {
  return src("./app/js/*.js")
    .pipe(changed("./dist/"))

    .pipe(plumber(plumberNotify("Scripts")))
    .pipe(babel())
    .pipe(webpack(require("./webpack.config.js")))
    .pipe(dest("./dist/js"))
    .pipe(browserSync.stream());
}

const dev = series(
  clearDist,
  html,
  styles,
  scripts,
  images,
  svgSprite,
  parallel(browsersync, watcher)
);

function webP() {
  return src([
    "./dist/images/**/*.*",
    "!./dist/images/**/*.svg",
    "!./dist/images/svg/",
  ])
    .pipe(webp())
    .pipe(dest("./dist/images/"));
}

function devCss() {
  return src("./dist/css/style.css")
    .pipe(webPCss())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 5 version"],
        grid: true,
      })
    )
    .pipe(groupMedia())
    .pipe(csso())
    .pipe(dest("./dist/css/"));
}

function devHtml() {
  return src("./dist/*.html")
    .pipe(webPHtml())
    .pipe(htmlclean())
    .pipe(dest("./dist/"));
}

const production = series(webP, devHtml, devCss);

exports.html = html;
exports.styles = styles;
exports.images = images;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.clearDist = clearDist;
exports.watcher = watcher;
exports.webP = webP;
exports.devCss = devCss;
exports.devHtml = devHtml;
exports.svgSprite = svgSprite;
exports.default = dev;
exports.production = production;
