const commandhandler = require("../../handlers/commandHandler");

module.exports.run = async (client, message, args) => {
  try {
    if (message.deletable) message.delete();

    if (!args || args.length < 1) {
      commandhandler.reloadAllCommands(client);
      await commandhandler.run(client);

      message
        .reply("toutes les commandes ont été rechargés!")
        .then(msg => msg.delete({ timeout: 2000 }));
    } else {
      const commandName = args[0];
      if (!client.commands.has(commandName)) {
        return message
          .reply("cette commande n'existe pas...")
          .then(msg => msg.delete({ timeout: 2000 }));
      }

      commandhandler.reloadCommand(client, commandName);
      message
        .reply(`la commande ${commandName} a été rechargée!`)
        .then(msg => msg.delete({ timeout: 2000 }));
    }
  } catch (e) {
    console.log(e);
  }
};

module.exports.help = {
  name: "reload",
  aliases: ["rld"],
  description: "Recharge les commandes.",
  usage: "<noarg>/<commande>",
  category: "Système"
};

module.exports.requirements = {
  userPerms: ["ADMINISTRATOR"],
  clientPerms: [],
  ownerOnly: true
};

module.exports.limits = {
  rateLimit: 1,
  cooldown: 30 * 1000
};
