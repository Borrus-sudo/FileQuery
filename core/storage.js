const fs = require("fs");
const os = require("os");
let dotFileLocation;
const obj = {
    aliases: [],
    curr_dir: "null"
}
switch (os.platform()) {
    case "win32":
        console.log("Windows OS detected");
        dotFileLocation = "C:\\Users\\Jinmay\\.file-query";
        break;

    default:
        break;
}
//Default Checking 
(() => {
    if (!fs.existsSync(dotFileLocation)) {
        fs.open(dotFileLocation, 'w', function(err, file) {
            if (err) throw err;
            console.log(file);
        });
    }
})();
module.exports = {
    updateDotFile(content) {
        fs.writeFileSync(dotFileLocation, content, {
            flag: 'a+'
        }, (err) => {
            console.error(err)
        })
    }
}