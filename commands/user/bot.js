const { MessageEmbed } = require("discord.js");
const dateFormat = require("../../functions/dateFormat");

module.exports.run = (client, message, args) => {
  if (message.deletable) message.delete();

  message.reply(`voici les infos du bot:`);
  const embed = new MessageEmbed()
    .setAuthor(client.user.username, client.user.displayAvatarURL())
    .addField("Bot ID", client.user.id, true)
    .addField(
      "Création",
      dateFormat.getMinimalDate(client.user.createdAt),
      true
    )
    .addField("Serveurs", client.guilds.cache.size, true)
    .addField("Membres", client.users.cache.size, true)
    .addField("Salons", client.channels.cache.size, true)
    .addField("Emojis", client.emojis.cache.size, true)
    .addField("Uptime", dateFormat.formatUptime(client.uptime / 1000), true)
    .setColor("RANDOM")
    .setThumbnail(client.user.displayAvatarURL());
  message.channel.send({ embed: embed });
};

module.exports.help = {
  name: "bot",
  description: "Renvoie les infos du bot.",
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
