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
var unusedClassNames = [];

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
  htmlFilesPathArray.forEach((html, index) => {
    const htmlContent = fs.readFileSync(html.path);
    let $ = cheerio.load(htmlContent);

    console.log("Checking:", html.path);

    cssClassesArray.forEach(css => {
      if (css.checked) {
        return false;
      } else {
        let isUsed = $(css.class).length !== 0;

        if (isUsed) {
          css.checked = true;
        }
      }
    });

    if (index === htmlFilesPathArray.length - 1) {
      sortUnusedClasses();
    }
  });
}

function sortUnusedClasses() {
  cssClassesArray.forEach(element => {
    if (!element.checked) {
      unusedClassNames.push(element.class);
    }
  });

  // console.log("Unused Classes Array:", unusedClassNames);
  console.log(
    "Total Unused:",
    unusedClassNames.length,
    "From:",
    cssClassesArray.length
  );
}

getHtmlFilesPathArray();
