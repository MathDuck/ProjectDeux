const serverQueryFactory = require("../../factories/serverQueryFactory");

module.exports.run = async (client, message, args) => {
  if (message.deletable) message.delete();

  let serverData = await serverQueryFactory
    .checkDataQuery(client)
    .get(message.guild.id);

  let supportStatus;
  if (serverData.support_system === 1) supportStatus = 0;
  else supportStatus = 1;

  await serverQueryFactory
    .updateSupportSystemQuery(client)
    .run(supportStatus, message.guild.id);

  return message
    .reply(
      "le support ticket est " +
        (supportStatus === 1 ? "activé" : "désactivé") +
        " sur le serveur!"
    )
    .then(msg => msg.delete({ timeout: 3000 }));
};

module.exports.help = {
  name: "support-switch",
  aliases: ["s-switch"],
  description: "Active/Désactive le support.",
  usage: "",
  category: "Support"
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
