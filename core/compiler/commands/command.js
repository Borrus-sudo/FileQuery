const storage = require("../../storage");
const fs = require("fs");
const path = require("path");
const ask = require("inquirer");
const exec = require("child_process").execSync;
const colors = require("colors");
const removeDirectory = (path) => {
    if (fs.existsSync(path)) {
        const files = fs.readdirSync(path) || [];
        files.forEach(function(filename) {
            if (fs.statSync(path + "/" + filename).isDirectory()) {
                removeDirectory(path + "/" + filename)
            } else {
                fs.unlinkSync(path + "/" + filename)
            }
        })
    }
    fs.rmdirSync(path);
}
colors.setTheme({
    info: 'bgGreen',
    help: 'cyan',
    warn: 'yellow',
    success: 'bgBlue',
    error: 'red'
});
const commands = {
    "IntroduceCommand": {
        execute(data) {
            console.log(`
 _______ _________ _        _______    _______           _______  _______          
(  ____ \\__   __/( \      (  ____ \  (  ___  )|\     /|(  ____ \(  ____ )|\     /|
| (    \/   ) (   | (      | (    \/  | (   ) || )   ( || (    \/| (    )|( \   / )
| (__       | |   | |      | (__      | |   | || |   | || (__    | (____)| \ (_) / 
|  __)      | |   | |      |  __)     | |   | || |   | ||  __)   |     __)  \   /  
| (         | |   | |      | (        | | /\| || |   | || (      | (\ (      ) (   
| )      ___) (___| (____/\| (____/\  | (_\ \ || (___) || (____/\| ) \ \__   | |   
|/       \_______/(_______/(_______/  (____\/_)(_______)(_______/|/   \__/   \_/   
                                                                                   
`);
            console.log(data.message);
        }
    },
    "Error": {
        execute(data) {
            console.log(data.errorMessage);
        },
    },
    "CreateCommand": {
        async execute(data) {
            const isFileRegex = /(.*?)\.(.*?)$/;
            for (let directory of data.directories) {
                const resolvedPath = path.join(data.baseDirectory, directory);
                if (!fs.existsSync(directory)) {
                    if (isFileRegex.test(resolvedPath)) {
                        fs.writeFileSync(resolvedPath, "");
                    } else {
                        fs.mkdirSync(resolvedPath);
                    }
                } else {
                    const {
                        override
                    } = await ask.prompt([{
                        type: "confirm",
                        name: "override",
                        message: "Conflict on `" + directory + "` Do you want to override?",
                        default: false
                    }]);
                    if (override) {
                        if (isFileRegex.test(directory)) {
                            fs.writeFileSync(resolvedPath, "");
                        } else {
                            removeDirectory(resolvedPath);
                            fs.mkdirSync(resolvedPath);
                        }
                    }
                }
            }
            if (data.via != "none") {
                if (data.via === "code")
                    exec(`code .`, data.baseDirectory, (error, stdout, stderr) => {
                        if (error) {
                            console.log(`An error occured: ${error.message}`);
                            return;
                        }
                        if (stderr) {
                            console.log(`An error occured : ${stderr}`);
                            return;
                        }
                    });
            }
            console.log("Operation successfully completed");
        }
    },
    "SetCommand": {
        execute(data) {
            const pairs = data.pairs;
            for (const pair of pairs) {
                storage.updateOptions(pair.key, pair.value);
            }
            console.log(`Operation completed successfully`);
        },
    },
    "CopyPasteCommand": {
        execute(data) {
            let isError = false;
            for (let directory of data.directories) {
                const resolvedPath = path.join(data.baseDirectory, directory);
                if (fs.existsSync(resolvedPath)) {
                    if (fs.existsSync(directory))
                        fs.copyFileSync(resolvedPath, path.resolve(data.to, directory));
                    else
                        console.log(("The directory " + resolvedPath + " does not exist").error);
                } else {
                    console.log(("The directory " + resolvedPath + " does not exist").error);
                }
            }
            if (!isError)
                console.log("Operation successfully finished".success);
        }
    },
    "SelectCommand": {
        execute(data) {
            console.log("Select Command Called");
        }
    },
    "ReturnConfigCommand": {
        execute(data) {
            console.log(JSON.stringify(storage.returnConfig(), null, 2));
            console.log("Operation successfully finished".success);
        }
    }
};
module.exports = commands;