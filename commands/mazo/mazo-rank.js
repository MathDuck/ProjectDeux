const mazoQueryFactory = require("../../factories/mazoQueryFactory");
const { MessageEmbed } = require("discord.js");

module.exports.run = async (client, message, args) => {
  if (message.deletable) message.delete();
  const globalMazoData = mazoQueryFactory
    .getMazoDataQuery(client)
    .all(message.guild.id, 12);

  if (!globalMazoData)
    return message
      .reply(`Il n'y a aucun classement sur ce serveur`)
      .then(msg => msg.delete({ timeout: 3000 }));

  let ranking = [];
  let i = 1;

  for (const cat of globalMazoData) {
    ranking.push(
      `${i}) **${cat.username}** - ${cat.top_score} Point(s) Mazo\n`
    );
    i++;
  }

  const rankingEmbed = new MessageEmbed()
    /*.setAuthor(
                message.guild.me.displayName,
                message.guild.me.user.avatarURL()
              )*/
    .setTitle("Classement MAZO")
    .setDescription(
      `Hey **${
        message.author.tag
      }**, voici le classement des 12 premiers!\n\n${ranking
        .join("")
        .replace(/^\s+|\s+$/g, "")}`
    )
    .setColor("GRAY")
    .setTimestamp();
  message.channel.send({ embed: rankingEmbed });
};

module.exports.help = {
  name: "mazo-rank",
  aliases: ["mrank"],
  description: "Montre le classement actuel du mazo.",
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
