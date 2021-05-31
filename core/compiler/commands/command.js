const storage = require("../../storage");
const fs = require("fs");
const path = require("path");
const ask = require("inquirer");
const exec = require("child_process").execSync;
const copydir = require('copy-dir');
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
    if (process.cwd() !== path) {
        fs.rmdirSync(path);
    }

}


const introHeading = String.raw `
 _______ _________ _        _______    _______           _______  _______          
(  ____ \\__   __/( \      (  ____ \  (  ___  )|\     /|(  ____ \(  ____ )|\     /|
| (    \/   ) (   | (      | (    \/  | (   ) || )   ( || (    \/| (    )|( \   / )
| (__       | |   | |      | (__      | |   | || |   | || (__    | (____)| \ (_) / 
|  __)      | |   | |      |  __)     | |   | || |   | ||  __)   |     __)  \   /  
| (         | |   | |      | (        | | /\| || |   | || (      | (\ (      ) (   
| )      ___) (___| (____/\| (____/\  | (_\ \ || (___) || (____/\| ) \ \__   | |   
|/       \_______/(_______/(_______/  (____\/_)(_______)(_______/|/   \__/   \_/   
                                                                                   
`;

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
            console.log(introHeading);
            console.log(data.message.info);
        }
    },
    "Error": {
        execute(data) {
            console.log(data.errorMessage.error);
        },
    },
    "CreateCommand": {
        async execute(data) {
            const isFileRegex = /(.*?)\.(.*?)$/;
            for (let directory of data.directories) {
                const resolvedPath = path.resolve(data.baseDirectory, directory);
                if (!fs.existsSync(directory)) {
                    if (isFileRegex.test(resolvedPath)) {
                        fs.writeFileSync(resolvedPath, "");
                    } else {
                        fs.mkdirSync(resolvedPath);
                    }
                } else if (isFileRegex.test(resolvedPath)) {
                    const {
                        override
                    } = await ask.prompt([{
                        type: "confirm",
                        name: "override",
                        message: "Conflict on `" + directory + "` Do you want to override?",
                        default: false
                    }]);
                    if (override) {
                        fs.writeFileSync(resolvedPath, "");
                    }
                }
            }
            if (data.via != "none") {
                if (data.via === "code")
                    exec(`code .`, {
                            cwd: data.baseDirectory
                        },
                        (error, stdout, stderr) => {
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
            console.log("Operation successfully completed".success);
        }
    },
    "SetCommand": {
        execute(data) {
            const pairs = data.pairs;
            for (const pair of pairs) {
                storage.updateOptions(pair.key, pair.value);
            }
            console.log(`Operation completed successfully`.success);
        },
    },
    "CopyPasteCommand": {
        execute(data) {
            let isError = false;
            for (let directory of data.directories) {
                const from = path.resolve(data.baseDirectory, directory);
                const portions = directory.split("/");
                const to = path.resolve(data.to, portions[portions.length - 1]);
                if (fs.existsSync(from)) {
                    if (fs.existsSync(data.to)) {
                        if (fs.statSync(from).isFile())
                            fs.copyFileSync(from, to);
                        else
                            copydir.sync(from, to, {
                                utimes: true,
                                mode: true,
                                cover: true
                            });
                    } else {
                        isError = true
                        console.log(("The directory " + to + " does not exist").error);
                    }
                } else {
                    isError = true;
                    console.log(("The directory " + from + " does not exist").error);
                }
            }
            if (!isError)
                console.log("Operation successfully finished".success);
        }
    },
    "DeleteCommand": {
        execute(data) {
            let isError = false;
            for (let directory of data.directories) {
                const toDelete = path.resolve(data.baseDirectory, directory);
                if (fs.existsSync(toDelete)) {
                    if (fs.statSync(toDelete).isFile())
                        fs.unlinkSync(toDelete);
                    else
                        removeDirectory(toDelete);
                } else {
                    isError = true;
                    console.log(("The directory " + toDelete + " does not exist").error);
                }
            }
            if (!isError)
                console.log("Operation successfully finished".success);
        }

    },
    "HelpCommand": {
        execute(data) {
            console.log(introHeading);
            console.log("Available commands:" + "\n" + (["Help (jj help)", "Create(jj create)", "Delete(jj del)", "Set(jj set)", "Introduce(jj introduce)", "CopyPaste(jj cv)"].join("\n")).info);
        }
    },
    "SelectCommand": {
        execute(data) {
            console.log("Select Command Called");
        }
    },
    "RunMacroCommand": {
        execute(data) {
            let isError = false;

            function execute(macro, context) {
                if (fs.existsSync(macro)) {
                    if (!fs.existsSync(context)) {
                        isError = true;
                        console.log(("The path " + context + " does not exist").error);
                    } else {
                        const lines = fs.readFileSync(macro, {
                            encoding: 'utf8',
                            flag: 'r'
                        }).split("\n");
                        lines.forEach((line) => {
                            if (!isError)
                                if (line)
                                    exec(line.trim(), {
                                        cwd: context
                                    }, (error, stdout, stderr) => {
                                        console.log(stdout);
                                        if (error) {
                                            isError = true;
                                            console.log(`An error occured: ${error.message}`);
                                            return;
                                        }
                                        if (stderr) {
                                            isError = true;
                                            console.log(`An error occured : ${stderr}`);
                                            return;
                                        }
                                        // console.log("Finished");
                                        // console.log(stdout);
                                    });
                        });
                    }
                } else {
                    isError = true;
                    console.log(("The path " + macro + " does not exist").error);
                }
            }
            for (let macro of data.macros) {
                const macroPath = path.resolve(data.cwd, macro);
                execute(macroPath, data.context);
            }
            if (!isError)
                console.log("Operation suuccessfully finished".success);
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