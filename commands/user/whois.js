const { stripIndents } = require("common-tags");
const { MessageEmbed } = require("discord.js");

module.exports.run = (client, message, args) => {
  let member = message.mentions.members.first();

  if (!args[0]) member = message.member;

  if (!member) {
    if (message.deletable) message.delete();
    return message
      .reply(`impossible de trouver ${args[0]}`)
      .then(msg => msg.delete({ timeout: 2000 }));
  }

  // Member variables
  const joined = Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  })
    .format(member.joinedAt)
    .split("-")
    .reverse()
    .join("-");
  const roles =
    member.roles.cache
      .filter(r => r.id !== message.guild.id)
      .map(r => r)
      .join(", ") || "Aucun";

  // User variables
  const created = Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  })
    .format(member.user.createdAt)
    .split("-")
    .reverse()
    .join("-");

  const embed = new MessageEmbed()
    .setAuthor(message.guild.me.displayName, message.guild.me.user.avatarURL())
    .setThumbnail(member.user.displayAvatarURL())
    .setColor(
      member.displayHexColor === "#000000" ? "#ffffff" : member.displayHexColor
    )

    .addField(
      "Infos membre:",
      stripIndents`> **Pseudo:** *${member.displayName}*
            > **Arrivée:** *${joined}*
            > **Rôles:** *${roles}*`,
      true
    )

    .addField(
      "Infos utilisateur:",
      stripIndents`> **ID:** *${member.user.id}*
            > **Pseudo**: *${member.user.username}*
            > **Tag**: *${member.user.tag}*
            > **Créé le**: *${created}*`,
      true
    )

    .setTimestamp();

  if (member.user.presence.activity)
    embed.addField(
      "Activité actuelle:",
      stripIndents`> *${member.user.presence.activity.name}*`
    );

  message.channel.send(embed);
};

module.exports.help = {
  name: "whois",
  aliases: ["info"],
  description:
    "Donne des infos sur un utilisateur ou soi-même si aucun argument.",
  usage: "<>/<pseudo>",
  category: "Utilisateur"
};

module.exports.requirements = {
  userPerms: [],
  clientPerms: [],
  ownerOnly: false
};

module.exports.limits = {
  rateLimit: 3,
  cooldown: 30 * 1000
};
