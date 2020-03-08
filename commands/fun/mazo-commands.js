const serverQueryFactory = require("../../factories/serverQueryFactory");
const { MessageEmbed } = require("discord.js");

module.exports.run = async (client, message, args) => {
  if (message.deletable) message.delete();

  let serverData = await serverQueryFactory
    .checkDataQuery(client)
    .get(message.guild.id);

  const helpEmbed = new MessageEmbed()
    .setAuthor(message.guild.me.displayName, message.guild.me.user.avatarURL())
    .setTitle("Commandes MAZO")
    .setDescription(
      `Hey **${message.author.tag}**, voici les commandes du Mazo!`
    )
    .addField(
      `**${serverData.prefix}mazo-set**`,
      "*Initialise le mazo. (Commande admin)*"
    )
    .addField(`**${serverData.prefix}mazo**`, "*Lance une session.*")
    .addField(
      `**${serverData.prefix}mazo-switch**`,
      "*Permet d'activer/de désactiver le mazo.*"
    )
    .addField(`**${serverData.prefix}mazo-score**`, "*Donne son score.*")
    .addField(
      `**${serverData.prefix}mazo-rank**`,
      "*Retourne le classement général.*"
    )
    .setColor("BLUE")
    .setTimestamp();
  message.channel.send({ embed: helpEmbed });
};

module.exports.help = {
  name: "mazo-commands",
  aliases: ["mcmds"],
  description: "Montre son propre score et record actuel du mazo.",
  usage: "",
  category: "Jeux"
};

module.exports.requirements = {
  userPerms: [],
  clientPerms: [],
  ownerOnly: false
};

module.exports.limits = {
  rateLimit: 1,
  cooldown: 10 * 1000
};
