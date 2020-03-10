const { MessageEmbed } = require("discord.js");
const serverQueryFactory = require("../../factories/serverQueryFactory");
const userQueryFactory = require("../../factories/userQueryFactory");

//https://chart.googleapis.com/chart?chs=750x300&chd=t:60,40,14,26&chl=Hello|World&cht=bvs&chxt=y

module.exports.run = async (client, message, args) => {
  if (message.deletable) message.delete();

  const globalServerData = await serverQueryFactory
    .checkDataQuery(client)
    .get(message.guild.id);

  if (globalServerData.game_system === 1) {
    const sortedUserData = await userQueryFactory
      .getSortedUsersByGPQuery(client)
      .all(message.guild.id, 20);

    let chd = [];
    let chl = [];

    let ranking = [];
    let i = 1;

    for (const user of sortedUserData) {
      chd.push(`${user.game_points},`);
      chl.push(`${user.username.split("#")[0]}(${user.game_points})|`);

      ranking.push(`${i}) **${user.username}** - ${user.game_points} Points\n`);
      i++;
    }

    const link = `https://chart.googleapis.com/chart?chs=750x300&chds=a&cht=p&chxt=y&chd=t:${chd
      .join("")
      .replace(/,\s*$/, "")}&chl=${chl.join("").replace(/|\s*$/, "")}&chof=png`;

    const rankingEmbed = new MessageEmbed()
      .setAuthor(
        message.guild.me.displayName,
        message.guild.me.user.avatarURL()
      )
      .setTitle("Classement des points")
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
    //message.channel.send(link);
  } else {
    message.reply("le système des points de jeux est désactivé.");
  }
};

module.exports.help = {
  name: "lead",
  aliases: ["leaderboard"],
  description:
    "Renvoie un classement des leaders de points de jeux du serveur.",
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
