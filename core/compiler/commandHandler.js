 function commmandHandler(node, commands) {
     commands[node.type](node);
 }
 module.exports = commmandHandler