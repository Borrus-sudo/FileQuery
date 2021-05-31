#!/usr/bin/env node


//Dependencies
const parser = require("./core/parser");
const {
    commmandHandler: handler,
    commands
} = require("./core/compiler");

//Options initializing
const command = process.argv;
command.splice(0, 2);
const arguments = (command.length == 0 ? undefined : command);

//Executing Event Code
const handle = parser(arguments);
handler(handle, commands);