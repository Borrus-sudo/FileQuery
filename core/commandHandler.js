 const commands = {
     "IntroduceCommand" (data) {
         console.log(`Hi I am FileQuery to help you manage you files seemlessly`);
     },
     "InvalidCommand" (data) {
         console.log(`The entered command \`${data.command}\` is invalid `);
     }
 };

 function commmandHandler(node) {
     commands[node.type](node);
 }
 module.exports = commmandHandler