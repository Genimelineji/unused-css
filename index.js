const cheerio = require("cheerio");
const extract = require("string-extract-class-names");
var sass = require("sass");
const fs = require("fs");
var glob = require("glob");
var path = require("path");

var scssFilePath = "./sass/style.scss";
const HtmlFilesDir = "./html/";

var cssClassesArray = [];
var htmlFilesPathArray = [];

function extractClasses() {
  sass.render(
    {
      file: scssFilePath
    },
    function(err, result) {
      let cssString = result.css.toString();
      let extractedArray = extract(cssString);

      extractedArray.forEach(element => {
        cssClassesArray.push({
          class: element,
          checked: false
        });
      });

      checkForUnusedCssClass();
    }
  );
}

function getHtmlFilesPathArray() {
  glob(path.join(HtmlFilesDir, "**/*.html"), function(er, files) {
    files.forEach(element => {
      htmlFilesPathArray.push({
        path: element,
        checked: false
      });
    });

    extractClasses();
  });
}

function checkForUnusedCssClass() {
  htmlFilesPathArray.forEach(html => {
    const htmlContent = fs.readFileSync(html.path);
    let $ = cheerio.load(htmlContent);

    // cssClassesArray.forEach(css => {
    //   if (css.checked) {
    //     return;
    //   } else {
    //     let isUsed = $("." + css.class).length !== 0;

    //     if (isUsed) {
    //       css.checked = true;
    //     }
    //   }
    // });

    console.log($(".georgee").length !== 0, html.path);
  });
}

getHtmlFilesPathArray();
