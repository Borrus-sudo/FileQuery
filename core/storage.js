const fs = require("fs");
const os = require("os");
const dotFileLocation = path.join(process.env.HOME, '.file-query')
let options = {
    "curr_dir": "None set",
    "alias": []
};

//Default Stuff for updating options or creating a dotfile with default options if none created 
(() => {
    const checkPurity = (obj) => {
        for (let property in options) {
            if (!obj.hasOwnProperty(property)) {
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
            const parsedConfig = JSON.parse(dotFileConfig);
            if (checkPurity(parsedConfig)) {
                options = parsedConfig;
            } else {
                console.log("Looks like the dotfile has been corrupted.Delete the entire file to get the defaults again.But in doing so all the current config will be lost ");
            }
        }
    }
})();
module.exports = {
    updateOptions(propertyName, newValue) {
        if (propertyName === "curr_dir")
            options[propertyName] = newValue;
        else
            options[propertyName].push(newValue);
        const updatedConfig = JSON.stringify(options, null, 2);
        fs.writeFileSync(dotFileLocation, updatedConfig)
    },
    returnOption(propertyName) {
        return options[propertyName]
    },
    returnConfig() {
        return options;
    }
}