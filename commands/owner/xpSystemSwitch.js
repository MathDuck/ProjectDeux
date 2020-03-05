const serverQueryFactory = require("../../factories/serverQueryFactory");

module.exports.run = async (client, message, args) => {
  if (message.deletable) message.delete();

  let serverData = await serverQueryFactory
    .checkDataQuery(client)
    .get(message.guild.id);

  let xpSystemStatus;
  if (serverData.xpSystem === 1) xpSystemStatus = 0;
  else xpSystemStatus = 1;

  message
    .reply(
      "le système d'expérience est " +
        (xpSystemStatus === 1 ? "activé" : "désactivé") +
        " sur le serveur!"
    )
    .then(msg => msg.delete({ timeout: 3000 }));

  return await serverQueryFactory
    .updateXPSystemQuery(client)
    .run(xpSystemStatus, message.guild.id);
};

module.exports.help = {
  name: "xpswitch",
  aliases: ["xps"],
  description: "Active/Désactive le système d'expérience par message.",
  usage: "<>",
  category: "Gestion"
};

module.exports.requirements = {
  userPerms: ["ADMINISTRATOR"],
  clientPerms: ["ADMINISTRATOR"],
  ownerOnly: false
};

module.exports.limits = {
  rateLimit: 2,
  cooldown: 30 * 1000
};
