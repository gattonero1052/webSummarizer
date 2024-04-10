const fs = require('fs');

function replaceInFile(filePath, searchString, replacement) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file: ${err}`);
      return;
    }
    const modifiedContent = data.replace(new RegExp(searchString, 'g'), replacement);
    fs.writeFile(filePath, modifiedContent, 'utf8', (err) => {
      if (err) {
        console.error(`Error writing file: ${err}`);
        return;
      }
    });
  });
}

replaceInFile("./src/pages/content/style_out.css", ":root", ":host");
