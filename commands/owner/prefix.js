const serverQueryFactory = require("../../factories/serverQueryFactory");

module.exports.run = async (client, message, args) => {
  if (message.deletable) message.delete();

  if (!args[0]) {
    const checkServerData = await serverQueryFactory
      .checkDataQuery(client)
      .get(message.guild.id);

    return message
      .reply(
        `le préfixe actuel est \`${checkServerData.prefix}\`.\n\nPour changer le préfixe, merci d'en spécifier un nouveau en tant qu'argument. (Usage: ${checkServerData.prefix}prefix <Nouveau préfixe>)`
      )
      .then(m => m.delete({ timeout: 10000 }));
  }

  message.channel
    .send(
      `Le nouveau préfixe pour les commandes est désormais \`${args.join(
        " "
      )}\`.`
    )
    .then(msg => msg.delete({ timeout: 4000 }));

  await serverQueryFactory
    .updatePrefixQuery(client)
    .run(args.join(" "), message.guild.id);
};

module.exports.help = {
  name: "prefix",
  aliases: ["setprefix"],
  description: "Change le préfixe des commandes.",
  usage: "<préfixe>",
  category: "Gestion"
};

module.exports.requirements = {
  userPerms: ["ADMINISTRATOR"],
  clientPerms: [],
  ownerOnly: false
};

module.exports.limits = {
  rateLimit: 1,
  cooldown: 30 * 1000
};
