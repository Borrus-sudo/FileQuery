const storage = require("./storage");
const fs = require('fs');

function parser(command) {
    command = command || ["introduce"];
    const cwd = process.cwd();

    function resolveArraySyntax(command) {
        let commandArr = [...command];
        const simplyAdd = "SimplyAdd";
        if (command.includes('[') && command.includes(']') && commandArr.indexOf('[') < commandArr.lastIndexOf(']')) {
            if (commandArr.lastIndexOf(']') === commandArr.length - 1 && commandArr[0] != '[') {
                const startPos = commandArr.indexOf('[');
                const prefix = command.split('[')[0];
                let endPos = 'none';
                commandArr.forEach((elem, i) => {
                    if (elem === ']' && (commandArr[i + 1] === '[' || typeof commandArr[i + 1] === 'undefined')) {
                        endPos = i;
                    }
                });
                if (endPos != "none") {
                    let rpart = commandArr.slice(startPos + 1, endPos).join ``.split `,`.map((elem) => prefix + '/' + elem);
                    rpart.unshift(prefix);
                    return rpart;
                } else {
                    return simplyAdd;
                }
            }

        }
        return simplyAdd;
    }

    function resolveSpecialTokens(tokens) {
        tokens = tokens.map((token) => {
            switch (token) {
                case "./":
                    return cwd;
                case "curr_dir":
                    return storage.returnOption("curr_dir");
                default:
                    let toReturn = token;
                    const alisases = (storage.returnOption("alias") || []).map(alias => alias.split("-").reverse());
                    alisases.forEach(([elem, directory]) => {
                        if (token === elem) {
                            toReturn = directory;
                        }
                    });
                    return toReturn;
            }
        });
        return tokens;
    }

    function resolveAsteriskAndRegex(elems) {
        elems.forEach((directory) => {
            if (directory.includes('*')) {

            }
        });
    }
    switch (command[0]) {
        case "introduce":
            {
                return {
                    type: "IntroduceCommand",
                    command: command[0],
                    message: `Hi I am FileQuery to help you manage you files seamlessly `,
                }
            }
        case "set":
            {
                const pairs = [];
                const tokens = ["curr_dir", "alias"];
                if (command.length < 3) {
                    return {
                        type: "Error",
                        kind: "InvalidNumberOfArguments",
                        command: command[0],
                        errorMessage: `
                            Not enough arguments provided to the ${ command[0] }
                            command `
                    }
                }
                for (let i = 1; i < command.length; i += 2) {
                    const pair = {
                        key: command[i].toLowerCase(),
                        value: command[i + 1] || "Error"
                    }
                    if (pair.value === "Error") {
                        return {
                            type: "Error",
                            kind: "InvalidNumberofArguments",
                            command: command[0],
                            errorMessage: `No argument provided to the ${ pair.key }command `
                        }
                    }
                    if (!tokens.includes(pair.key)) {
                        return {
                            type: "Error",
                            kind: "InvalidArgumentName",
                            command: command[0],
                            errorMessage: `
                            Invalid argument ${ pair.key }provided to the command ${ command }
                            `
                        }

                    }
                    if (pair.key === "alias") {
                        if (!pair.value.includes("-")) {
                            return {
                                type: "Error",
                                kind: "InvalidArgument",
                                errorMessage: "Invalid argument provided to the alias command. Missing the '-'"
                            }
                        } else {
                            const parts = pair.value.split('-');
                            pair.value = resolveSpecialTokens(parts).join `-`;
                        }
                    } else {
                        pair.value = resolveSpecialTokens([pair.value])[0];
                    }
                    pairs.push(pair);
                }
                return {
                    type: "SetCommand",
                    command: command[0],
                    pairs
                }
            }
        case "create":
            {
                const directories = [];
                let via = 'none';
                let baseDirectory = cwd;
                const tokens = ["via", "in"];
                if (command[1] === "via") {
                    return {
                        type: "Error",
                        kind: "InvalidArgument",
                        errorMessage: `The command create is provided no files `
                    }
                }
                for (let i = 1; i < command.length; i++) {
                    if (!tokens.includes(command[i].toLowerCase())) {
                        //Check for array like directories
                        const result = resolveArraySyntax(command[i]);
                        if (result === "SimplyAdd") {
                            command[i] = resolveSpecialTokens([command[i]])[0];
                            directories.push(command[i]);
                        } else {
                            const toPush = resolveSpecialTokens(result);
                            directories.push(...toPush);
                        }
                    } else {
                        if (command[i].toLowerCase() === tokens[0]) {
                            via = command[i + 1] || "Error";
                            if (via === "Error") {
                                return {
                                    type: "Error",
                                    kind: "InvalidNumberofArguments",
                                    command: command[0],
                                    errorMessage: `No argument provided to the ${ command[i] } command `
                                }
                            }
                        } else {
                            baseDirectory = command[i + 1] || "Error";
                            if (baseDirectory === "Error") {
                                return {
                                    type: "Error",
                                    kind: "InvalidNumberofArguments",
                                    command: command[0],
                                    errorMessage: `No argument provided to the ${ command[i] }command `
                                }
                            }
                            baseDirectory = resolveSpecialTokens([baseDirectory])[0];
                        }
                        i++;
                    }
                }
                directories.filter((directory, index) => directories.indexOf(directory) === index);
                return {
                    type: "CreateCommand",
                    command: command[0],
                    directories,
                    baseDirectory,
                    via
                }
            }
        case "select":
            return {
                type: "SelectCommand"
            }
        case "del":
            {
                const directories = [];
                let baseDirectory = cwd;
                const tokens = ["in"];
                if (command.length < 2) {
                    return {
                        type: "Error",
                        kind: "InvalidNumberOfArguments",
                        command: command[0],
                        errorMessage: `Not enough arguments provided to the ${ command[0] } command `
                    }
                }
                for (let i = 1; i < command.length; i++) {
                    if (!tokens.includes(command[i].toLowerCase())) {
                        const result = resolveArraySyntax(command[i]);
                        if (result === "SimplyAdd") {
                            command[i] = resolveSpecialTokens([command[i]])[0];
                            directories.push(command[i]);
                        } else {
                            result.splice(0, 1);
                            const toPush = resolveSpecialTokens(result);
                            directories.push(...toPush);
                        }
                    } else {
                        baseDirectory = command[i + 1] || "Error";
                        if (baseDirectory === "Error") {
                            return {
                                type: "Error",
                                kind: "InvalidNumberofArguments",
                                command: command[0],
                                errorMessage: `No argument provided to the ${command[i]}command `
                            }
                        }
                        baseDirectory = resolveSpecialTokens([baseDirectory])[0];
                        i++;
                    }
                }
                return {
                    type: "DeleteCommand",
                    directories,
                    baseDirectory
                }
            }
        case "cv":
            {
                const directories = [];
                let baseDirectory = cwd;
                const tokens = ["in", "to"];
                let to = "none";
                if (command.length < 2) {
                    return {
                        type: "Error",
                        kind: "InvalidNumberOfArguments",
                        command: command[0],
                        errorMessage: `Not enough arguments provided to the ${ command[0] } command `
                    }
                }
                for (let i = 1; i < command.length; i++) {
                    if (!tokens.includes(command[i].toLowerCase())) {
                        const result = resolveArraySyntax(command[i]);
                        if (result === "SimplyAdd") {
                            command[i] = resolveSpecialTokens([command[i]])[0];
                            directories.push(command[i]);
                        } else {
                            result.splice(0, 1);
                            const toPush = resolveSpecialTokens(result);
                            directories.push(...toPush);
                        }
                    } else {
                        if (command[i].toLowerCase() === tokens[0]) {
                            baseDirectory = command[i + 1] || "Error";
                            if (baseDirectory === "Error") {
                                return {
                                    type: "Error",
                                    kind: "InvalidNumberofArguments",
                                    command: command[0],
                                    errorMessage: `No argument provided to the ${command[i]}command `
                                }
                            }
                            baseDirectory = resolveSpecialTokens([baseDirectory])[0];
                        } else {
                            to = command[i + 1] || "Error";
                            if (to === "Error") {
                                return {
                                    type: "Error",
                                    kind: "InvalidNumberofArguments",
                                    command: command[0],
                                    errorMessage: `No argument provided to the ${command[i]}command `
                                }
                            }
                            to = resolveSpecialTokens([to])[0];
                        }
                        i++;
                    }
                }
                if (to === "none") {
                    return {
                        type: "Error",
                        kind: "InvalidNumberofArguments",
                        command: command[0],
                        errorMessage: `No argument provided to the to command `
                    }
                }
                return {
                    type: "CopyPasteCommand",
                    directories,
                    baseDirectory,
                    to
                }
            }
        case "give":
            {
                return {
                    type: "ReturnConfigCommand"
                }
            }
        case "run":
            {
                const tokens = ["in"]
                let baseDirectory = cwd;
                const macros = [];
                if (command.length < 2) {
                    return {
                        type: "Error",
                        kind: "InvalidNumberOfArguments",
                        command: command[0],
                        errorMessage: `Not enough arguments provided to the ${ command[0] } command `
                    }
                }
                for (let i = 1; i < command.length; i++) {
                    if (!tokens.includes(command[i].toLowerCase())) {
                        const result = resolveArraySyntax(command[i]);
                        if (result === "SimplyAdd") {
                            command[i] = resolveSpecialTokens([command[i]])[0];
                            macros.push(command[i]);
                        } else {
                            result.splice(0, 1);
                            const toPush = resolveSpecialTokens(result);
                            macros.push(...toPush);
                        }
                    } else {
                        baseDirectory = command[i + 1] || "Error";
                        if (baseDirectory === "Error") {
                            return {
                                type: "Error",
                                kind: "InvalidNumberofArguments",
                                command: command[0],
                                errorMessage: `No argument provided to the ${command[i]}command `
                            }
                        }
                        baseDirectory = resolveSpecialTokens([baseDirectory])[0];
                        i++;
                    }
                }
                return {
                    type: "RunMacroCommand",
                    baseDirectory,
                    macros
                }
            }
        case "help":
            return {
                type: "HelpCommand",
            }
        default:
            return {
                type: "Error",
                kind: "InvalidCommand",
                command: command[0],
                errorMessage: `The command ${ command[0] } is invalid `
            }
    }
}
module.exports = parser;