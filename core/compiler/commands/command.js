const commands = {
    "IntroduceCommand" (data) {
        console.log(`Hi I am FileQuery to help you manage you files seemlessly`);
    },
    "Error" (data) {
        console.log(data.errorMessage);
    },
    "CreateCommand" (data) {

    },
    "SetCommand": {
        execute(data) {
            const result = this.validator(data.command, ...data.pairs);
            if (result.value) {
                console.log("Command Execution Code");
            } else {
                commmandHandler(result.errorFST)
            };
        },
        validator(command, ...pairs) {
            const tokens = ["curr_dir"];
            for (let pair of pairs) {
                if (!tokens.includes(pair.key.toLowerCase())) {
                    const errorFST = {
                        type: "Error",
                        kind: "InvalidArgumentName",
                        errorMessage: `Invalid argument ${pair.key} provided to the command ${command}`
                    };
                    return {
                        value: false,
                        errorFST
                    }
                }
            }
            return {
                value: true,
                errorFST: null
            }
        }
    },
    "SelectCommand" (data) {

    }
};
module.exports = commands;