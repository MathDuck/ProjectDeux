const { inspect } = require("util");

module.exports.run = async (client, message, args) => {
  if (message.deletable) message.delete();
  const input = args.join(" ");
  try {
    let output = eval(input);
    if (typeof output !== "string") output = inspect(output);
    if (output.length > 1950) output = `${output.substr(0, 1950)}...`;
    message.channel.send(`Input: eval(${input});\nOutput:\n${output}`, {
      code: "js"
    });
  } catch (error) {
    message.channel.send(`**Erreur:** \n\`${error}\``);
  }
};

module.exports.help = {
  name: "eval",
  description: "Permet d'évaluer du code JavaScript.",
  usage: "<>",
  category: "Système"
};

module.exports.requirements = {
  userPerms: ["ADMINISTRATOR"],
  clientPerms: ["ADMINISTRATOR"],
  ownerOnly: true
};

module.exports.limits = {
  rateLimit: 5,
  cooldown: 30 * 1000
};
