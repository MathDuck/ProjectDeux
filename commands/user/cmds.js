const { prefix } = require("../../config");

module.exports.run = async (client, message, args) => {
  const longest = client.commands.reduce(
    (long, str) => Math.max(long, str.length),
    0
  );
  let currentCat = "";
  let output = `= Liste des commandes =\n`;
  const sorted = client.commands
    .array()
    .sort((p, c) =>
      p.help.category > c.help.category
        ? 1
        : p.help.name > c.help.name && p.help.category === c.help.category
        ? 1
        : -1
    );
  sorted.forEach(c => {
    const cat = c.help.category;
    if (currentCat !== cat) {
      output += `\u200b\n== ${cat} ==\n`;
      currentCat = cat;
    }
    let aliases = "";
    if (c.help.aliases && Array.isArray(c.help.aliases)) {
      aliases = `[alias: ${c.help.aliases}]`;
    }
    output += `${prefix}${c.help.name}${" ".repeat(
      longest - c.help.name.length
    )} :: ${c.help.description} ${aliases}\n`;
  });
  message.channel.send(output, {
    code: "asciidoc",
    split: { char: "\u200b" }
  });
};

module.exports.help = {
  name: "cmds",
  aliases: ["cmd"],
  description: "Renvoie la liste des commandes.",
  usage: "<>",
  category: "Utilisateur"
};

module.exports.requirements = {
  userPerms: [],
  clientPerms: [],
  ownerOnly: false
};

module.exports.limits = {
  rateLimit: 2,
  cooldown: 5 * 1000
};
