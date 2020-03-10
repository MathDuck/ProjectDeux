const serverQueryFactory = require("../../factories/serverQueryFactory");

module.exports.run = async (client, message, args) => {
  let serverData = await serverQueryFactory
    .checkDataQuery(client)
    .get(message.guild.id);

  if (message.deletable) message.delete();
  if (!message.member.permissions.has("ADMINISTRATOR"))
    return message
      .reply("seul un administrateur peut activer ou désactiver le mazo.")
      .then(msg => msg.delete({ timeout: 4000 }));

  let mazoStatus;
  if (serverData.mazo_enabled === 1) mazoStatus = 0;
  else mazoStatus = 1;

  await serverQueryFactory
    .updateMazoSystemQuery(client)
    .run(mazoStatus, serverData.mazo_configured, message.guild.id);
  mazoEnabled = mazoStatus;

  return message
    .reply(
      "le mazo est " +
        (mazoStatus === 1 ? "activé" : "désactivé") +
        " sur le serveur!"
    )
    .then(msg => msg.delete({ timeout: 3000 }));
};

module.exports.help = {
  name: "mazo-switch",
  aliases: ["mswitch"],
  description: "Activer/Désactiver le mazo sur le serveur.",
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
