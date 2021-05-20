function parser(command) {
    command = command || ["introduce"];
    switch (command[0]) {
        case "introduce":
            return {
                type: "IntroduceCommand",
                command: command[0],
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
                        errorMessage: `Not enough arguments provided to the ${command[0]} command `
                    }
                }
                for (let i = 1; i < command.length; i += 2) {
                    const pair = {
                        key: command[i].toLowerCase(),
                        value: command[i + 1]
                    }
                    if (!tokens.includes(pair.key)) {;
                        return {
                            type: "Error",
                            kind: "InvalidArgumentName",
                            errorMessage: `Invalid argument ${pair.key} provided to the command ${command}`
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
            if (command[1] === "via") {
                return {
                    type: "Error",
                    kind: "InvalidArgument",
                    errorMessage: `The command create is provided no files`
                }
            }
            for (let i = 1; i < command.length; i++) {

            }
            return {
                type: "CreateCommand",
                command: command[0],
                flags: {},
                directory: process.cwd(),
                software: ""
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
                errorMessage: `The command \`${ command[0] }\` is invalid`
            }
    }
}
module.exports = parser