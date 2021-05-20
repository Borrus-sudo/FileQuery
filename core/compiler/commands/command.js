const storage = require("../../storage");
const commands = {
    "IntroduceCommand": {
        execute(data) {
            console.log(`Hi I am FileQuery to help you manage you files seemlessly`);
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
            console.log(data);
        },
    },
    "SelectCommand": {
        execute(data) {
            console.log("Select Command Called");
        }
    }
};
module.exports = commands;