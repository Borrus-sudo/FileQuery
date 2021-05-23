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