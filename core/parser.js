function parser(command) {
    command = command || ["introduce"];

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
                    let rpart = commandArr.slice(startPos + 1, endPos).join ``.split `,`.map((elem) => '/' + prefix + '/' + elem);
                    return rpart;
                } else {
                    return simplyAdd;
                }
            }

        }
        return simplyAdd;
    }
    switch (command[0]) {
        case "introduce":
            return {
                type: "IntroduceCommand",
                command: command[0],
                message: `Hi I am FileQuery to help you manage you files seemlessly `,
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
                    if (!tokens.includes(pair.key)) {;
                        return {
                            type: "Error",
                            kind: "InvalidArgumentName",
                            command: command[0],
                            errorMessage: `
                            Invalid argument ${ pair.key }provided to the command ${ command }
                            `
                        }

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
                let baseDirectory = process.cwd();
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
                            directories.push(command[i]);
                        } else {
                            directories.push(...result);
                        }
                    } else {
                        if (command[i] === tokens[0]) {
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
                        }
                        i++;
                    }
                }
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
        default:
            return {
                type: "Error",
                kind: "InvalidCommand",
                command: command[0],
                errorMessage: `The command ${ command[0] } is invalid `
            }
    }
}
module.exports = parser