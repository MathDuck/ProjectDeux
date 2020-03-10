const { MessageEmbed } = require("discord.js");
const serverQueryFactory = require("../../factories/serverQueryFactory");
const userQueryFactory = require("../../factories/userQueryFactory");

module.exports.run = async (client, message, args) => {
  if (message.deletable) message.delete();

  const globalServerData = await serverQueryFactory
    .checkDataQuery(client)
    .get(message.guild.id);

  if (globalServerData.xpSystem === 1) {
    const sortedUserData = await userQueryFactory
      .getSortedUsersByXPQuery(client)
      .all(message.guild.id, 20);

    let ranking = [];
    let i = 1;

    for (const user of sortedUserData) {
      ranking.push(
        `${i}) **${user.username}** - ${user.xp_points} XP (Level: ${user.level})\n`
      );
      i++;
    }

    const rankingEmbed = new MessageEmbed()
      .setAuthor(
        message.guild.me.displayName,
        message.guild.me.user.avatarURL()
      )
      .setTitle("Classement XP")
      .setDescription(
        `Hey **${
          message.author.tag
        }**, voici le classement des 20 premiers!\n\n${ranking
          .join("")
          .replace(/^\s+|\s+$/g, "")}`
      )
      .setColor("GRAY")
      .setTimestamp();
    message.channel.send({ embed: rankingEmbed });
  } else {
    message
      .reply("le système de gain d'expérience est désactivé.")
      .then(msg => msg.delete({ timeout: 3000 }));
  }
};

module.exports.help = {
  name: "xplead",
  aliases: ["xpleaderboard"],
  description: "Renvoie un classement des leaders XP du serveur.",
  usage: "<>",
  category: "Utilisateur"
};

module.exports.requirements = {
  userPerms: [],
  clientPerms: [],
  ownerOnly: false
};

module.exports.limits = {
  rateLimit: 2,
  cooldown: 30 * 1000
};
