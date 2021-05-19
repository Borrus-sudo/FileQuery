#!/usr/bin/env node

//Dependencies
const exec = require("child_process").exec;
const fs = require("fs");
const parser = require("./core/parser");
const {
    handler,
    commands
} = require("./core/compiler");

//Options initializing
const command = process.argv;
const cwd = process.cwd();
command.splice(0, 2);
const arguments = (command.length == 0 ? undefined : command);

//Execution Code
const handle = parser(arguments);
handler(handle, commands);