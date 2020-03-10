const serverQueryFactory = require("../../factories/serverQueryFactory");
const userQueryFactory = require("../../factories/userQueryFactory");
const { MessageEmbed } = require("discord.js");

module.exports.run = async (client, message, args) => {
  if (message.deletable) message.delete();

  let serverData = await serverQueryFactory
    .checkDataQuery(client)
    .get(message.guild.id);

  let gameSystemStatus;
  if (serverData.game_system === 1) gameSystemStatus = 0;
  else gameSystemStatus = 1;

  await serverQueryFactory
    .updateGameSystemQuery(client)
    .run(gameSystemStatus, message.guild.id);

  message
    .reply(
      "les points de jeux sont " +
        (gameSystemStatus === 1 ? "activés" : "désactivés") +
        " sur le serveur!"
    )
    .then(msg => msg.delete({ timeout: 3000 }));
};

module.exports.help = {
  name: "gp-switch",
  aliases: ["gamepoints-switch", "gp-sw"],
  description: "Active/Désactive les points de jeu sur le serveur.",
  usage: "<>",
  category: "GamePoints"
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
