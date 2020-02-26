module.exports.run = async (client, message, args) => {
  if (message.deletable) message.delete();

  if (!args[0])
    return message
      .reply(
        `le préfixe actuel est \`${
          client.prefix[message.guild.id]
        }\`\nPour changer le préfixe, merci d'en spécifier un nouveau en tant qu'argument. (Usage: ${
          client.prefix[message.guild.id]
        }prefix <Nouveau préfixe>)`
      )
      .then(m => m.delete({ timeout: 10000 }));

  const data = await client.db
    .prepare("SELECT * FROM servers WHERE guildid = ? LIMIT 1")
    .get(message.guild.id);

  if (!data) {
    const result = await client.db
      .prepare("INSERT INTO servers (guildid, prefix) VALUES (?, ?)")
      .run(message.guild.id, args.join(" "));
  } else {
    const result = await client.db
      .prepare("UPDATE servers SET prefix = ? WHERE guildid = ? LIMIT 1")
      .run(args.join(" "), message.guild.id);
  }

  client.prefix[message.guild.id] = args.join(" ");
  message.channel
    .send(
      `Le nouveau préfixe pour les commandes est désormais \`${args.join(
        " "
      )}\``
    )
    .then(msg => msg.delete({ timeout: 4000 }));
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
