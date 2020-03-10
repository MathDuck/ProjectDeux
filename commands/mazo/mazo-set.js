const mazoQueryFactory = require("../../factories/mazoQueryFactory");
const serverQueryFactory = require("../../factories/serverQueryFactory");

module.exports.run = async (client, message, args) => {
  let serverData = await serverQueryFactory
    .checkDataQuery(client)
    .get(message.guild.id);

  if (message.deletable) message.delete();
  if (!message.member.permissions.has("ADMINISTRATOR"))
    return message
      .reply("seul un administrateur peut configurer le mazo.")
      .then(msg => msg.delete({ timeout: 4000 }));

  if (serverData.mazo_configured === 1)
    return message
      .reply("le mazo est déjà configuré sur le serveur.")
      .then(msg => msg.delete({ timeout: 4000 }));
  else
    await serverQueryFactory
      .updateMazoSystemQuery(client)
      .run(1, 1, message.guild.id);

  return message
    .reply("le mazo est dorénavant configuré et activé.")
    .then(msg => msg.delete({ timeout: 4000 }));
};

module.exports.help = {
  name: "mazo-set",
  aliases: ["mset"],
  description: "Configurer le mazo sur le serveur.",
  usage: "",
  category: "Jeux"
};

module.exports.requirements = {
  userPerms: ["ADMINISTRATOR"],
  clientPerms: ["ADMINISTRATOR"],
  ownerOnly: false
};

module.exports.limits = {
  rateLimit: 1,
  cooldown: 10 * 1000
};
