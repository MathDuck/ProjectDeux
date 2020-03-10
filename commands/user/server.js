const { MessageEmbed } = require("discord.js");
const dateFormat = require("../../functions/dateFormat");
const serverQueryFactory = require("../../factories/serverQueryFactory");

module.exports.run = async (client, message, args) => {
  if (message.deletable) message.delete();

  let serverData = await serverQueryFactory
    .checkDataQuery(client)
    .get(message.guild.id);

  message.reply(`voici les infos du serveur:`);
  const embed = new MessageEmbed()
    .setAuthor(message.guild.name, message.guild.iconURL())
    .addField("Serveur ID", message.guild.id, true)
    .addField("Propriétaire", message.guild.owner, true)
    .addField("Création", dateFormat.getDate(message.guild.createdAt), true)
    .addField("Membres", message.guild.memberCount, true)
    .addField("Rôles", message.guild.roles.cache.size, true)
    .addField("Salons", message.guild.channels.cache.size, true)
    .addField("Emojis", message.guild.emojis.cache.size, true)
    .addField("Commandes lancées", serverData.commandsLaunched, true)
    .setColor("RANDOM")
    .setThumbnail(message.guild.iconURL());

  message.channel.send({ embed: embed });
};

module.exports.help = {
  name: "server",
  aliases: ["info"],
  description: "Renvoie les infos du serveur.",
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
