const serverQueryFactory = require("../../factories/serverQueryFactory");

module.exports.run = async (client, message, args) => {
  if (message.deletable) message.delete();

  const checkServerData = await serverQueryFactory
    .checkDataQuery(client)
    .get(message.guild.id);

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
    let usage = "";
    if (!c.help.usage.startsWith("<>")) {
      usage = ` ${c.help.usage}`;
    }

    let aliases = "";
    if (c.help.aliases && Array.isArray(c.help.aliases)) {
      aliases = `[alias: ${c.help.aliases}]`;
    }
    output += `${checkServerData.prefix}${c.help.name}${usage}${" ".repeat(
      longest - c.help.name.length
    )} :: ${c.help.description} ${aliases}\n`;
  });

  message.reply(`voici la liste des commandes:`);
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
  rateLimit: 5,
  cooldown: 30 * 1000
};
