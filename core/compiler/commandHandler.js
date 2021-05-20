 function commmandHandler(node, commands) {
     const command = commands[node.type];
     command.execute(node)
 }
 module.exports = commmandHandler