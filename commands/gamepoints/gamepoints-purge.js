const serverQueryFactory = require("../../factories/serverQueryFactory");
const userQueryFactory = require("../../factories/userQueryFactory");
const { MessageEmbed } = require("discord.js");

module.exports.run = async (client, message, args) => {
  if (message.deletable) message.delete();

  let serverData = await serverQueryFactory
    .checkDataQuery(client)
    .get(message.guild.id);

  await userQueryFactory
    .purgeUsersGamePointsQuery(client)
    .run(message.guild.id);
  message
    .reply("Tout le monde est revenu à 0 point.")
    .then(m => m.delete({ timeout: 5000 }));
};

module.exports.help = {
  name: "gp-purge",
  aliases: ["gamepoints-purge", "gp-p"],
  description: "Remet à 0 les points de jeu du serveur complet.",
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
