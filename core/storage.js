const fs = require("fs");
const os = require("os");
let dotFileLocation;
let options = {
    "curr_dir": "None set",
    "aliases": []
};
switch (os.platform()) {
    case "win32":
        dotFileLocation = "C:\\Users\\Jinmay\\.file-query";
        break;

    default:
        break;
}
//Default Stuff for updating options or creating a dotfile with default options if none created 
(() => {
    const checkPurity = (obj) => {
        for (let property in options) {
            if (!`${property}` in obj) {
                return false;
            }
        }
        return true;
    }
    if (!fs.existsSync(dotFileLocation)) {
        const defaults = JSON.stringify(options, null, 2);
        fs.writeFileSync(dotFileLocation, defaults);
    } else {
        const dotFileConfig = fs.readFileSync(dotFileLocation, {
            encoding: 'utf8',
            flag: 'r'
        });
        if (dotFileConfig.trim() === "") {
            const defaults = JSON.stringify(options, null, 2);
            fs.writeFileSync(dotFileLocation, defaults);
        } else {
            if (checkPurity(dotFileConfig)) {
                options = JSON.parse(dotFileConfig);
            } else {
                console.log("Looks like the dotfile has been corrupted.Do you want it to be ");
            }
        }
    }
})();
module.exports = {
    updateOptions(propertyName, newValue) {
        options[propertyName] = newValue;
        const updatedConfig = JSON.stringify(options);
        fs.writeFileSync(dotFileLocation, updatedConfig)
    },
    returnOptions(propertyName) {
        return options[propertyName]
    }
}