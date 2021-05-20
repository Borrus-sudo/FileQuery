const storage = require("../../storage");
const commands = {
    "IntroduceCommand" (data) {
        console.log(`Hi I am FileQuery to help you manage you files seemlessly`);
    },
    "Error": {
        execute(data) {
            console.log(data.errorMessage);
        },
    },
    "CreateCommand" (data) {

    },
    "SetCommand": {
        execute(data) {
            const result = this.validator(data.command, ...data.pairs);
            if (result.isValid) {
                console.log("Command Execution Code");
            } else {
                commands[result.errorNode.type].execute(result.errorNode);
            };
        },
        validator(command, ...pairs) {
            const tokens = ["curr_dir", "alias"];
            for (let pair of pairs) {
                if (!tokens.includes(pair.key.toLowerCase())) {
                    const errorNode = {
                        type: "Error",
                        kind: "InvalidArgumentName",
                        errorMessage: `Invalid argument ${pair.key} provided to the command ${command}`
                    };
                    return {
                        isValid: false,
                        errorNode
                    }
                }
            }
            return {
                isValid: true,
                errorNode: null
            }
        }
    },
    "SelectCommand" (data) {

    }
};
module.exports = commands;