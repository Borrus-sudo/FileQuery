const commandTypeMapper = new Map();

function parser(command) {
    command = command || ["introduce"];
    switch (command[0]) {
        case "create":
            return {
                type: "CreateCommand",
                command: command[0],
                flags: {},
                directory: "",
                software: ""
            }
        case "introduce":
            return {
                type: "IntroduceCommand",
                command: command[0],
            }
        default:
            return {
                type: "InvalidCommand",
                command: command[0],
            }
    }
}
module.exports = parser