const { stripIndents } = require("common-tags");
const { MessageEmbed } = require("discord.js");
const mazoQueryFactory = require("../../factories/mazoQueryFactory");
const serverQueryFactory = require("../../factories/serverQueryFactory");
const userQueryFactory = require("../../factories/userQueryFactory");

module.exports.run = async (client, message, args) => {
  let member = message.mentions.members.first();

  if (!args[0]) member = message.member;

  if (!member) {
    if (message.deletable) message.delete();
    return message
      .reply(`impossible de trouver ${args[0]}`)
      .then(msg => msg.delete({ timeout: 2000 }));
  }

  const globalServerData = await serverQueryFactory
    .checkDataQuery(client)
    .get(message.guild.id);

  const userMazoData = await mazoQueryFactory
    .selectMazoUserQuery(client)
    .get(member.id);

  if (!userMazoData) return;

  let mazoString =
    globalServerData.mazo_enabled === 1
      ? stripIndents`> **Score:** ${userMazoData.current_score}
      > **Record:** ${userMazoData.top_score}`
      : "Désactivé";

  let userData = await userQueryFactory
    .selectUserQuery(client)
    .get(member.id, message.guild.id);

  let xpString =
    globalServerData.xp_system === 1
      ? stripIndents`> **XP:** ${userData.xp_points}
     > **Level:** ${userData.level}`
      : "Désactivé";

  let gpString =
    globalServerData.game_system === 1
      ? stripIndents`> **Points:** ${userData.game_points}`
      : "Désactivé";

  const embed = new MessageEmbed()
    .setAuthor(`Stats de ${member.user.tag} sur ${message.guild.name}`)
    .setThumbnail(member.user.displayAvatarURL())
    .setColor(
      member.displayHexColor === "#000000" ? "#ffffff" : member.displayHexColor
    )
    .addField("XP:", `${xpString}`, true)
    .addField("Points:", `${gpString}`, true)
    .addField("Mazo:", `${mazoString}`, true)
    .setTimestamp();

  message.channel.send(embed);
};

module.exports.help = {
  name: "stats",
  description:
    "Donne les stats d'un membre ou soi-même si aucun argument n'est donné.",
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
