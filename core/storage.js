const fs = require("fs");
const os = require("os");
const dotFileLocation = "C:\\Users\\Jinmay";
switch (os.platform()) {
    case "win32":
        console.log("Windows OS detected");
        break;

    default:
        break;
}
module.exports = {}