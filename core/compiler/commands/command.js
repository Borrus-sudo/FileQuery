const storage = require("../../storage");
const fs = require("fs");
const commands = {
    "IntroduceCommand": {
        execute(data) {
            console.log(data.message);
        }
    },
    "Error": {
        execute(data) {
            console.log(data.errorMessage);
        },
    },
    "CreateCommand": {
        execute(data) {
            console.log(data);
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
    "SelectCommand": {
        execute(data) {
            console.log("Select Command Called");
        }
    }
};
module.exports = commands;