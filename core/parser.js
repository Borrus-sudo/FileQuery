function parser(command) {
    command = command || ["introduce"];
    switch (command[0]) {
        case "introduce":
            return {
                type: "IntroduceCommand",
                command: command[0],
            }
        case "set":
            if (command.length < 3) {
                return {
                    type: "Error",
                    kind: "InvalidNumberOfArguments",
                    command: command[0],
                    errorMessage: `Not enough arguments provided to the ${command[0]} command `
                }
            }
            const pairs = [];
            for (let i = 1; i < command.length; i += 2) {
                pairs.push({ key: command[i], value: command[i + 1] });
            }
            return {
                type: "SetCommand",
                command: command[0],
                pairs
            }
        case "create":

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