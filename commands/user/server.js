const { MessageEmbed } = require("discord.js");
const date = require("../../functions/dateFormat");

module.exports.run = (client, message, args) => {
  if (message.deletable) message.delete();

  message.reply(`voici les infos du serveur:`);
  const embed = new MessageEmbed()
    .setAuthor(message.guild.name, message.guild.iconURL())
    .addField("Serveur ID", message.guild.id, true)
    .addField("Propriétaire", message.guild.owner, true)
    .addField("Création", date.getDate(message.guild.createdAt), true)
    .addField("Membres", message.guild.memberCount, true)
    .addField("Rôles", message.guild.roles.cache.size, true)
    .addField("Salons", message.guild.channels.cache.size, true)
    .addField("Emojis", message.guild.emojis.cache.size, true)
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
