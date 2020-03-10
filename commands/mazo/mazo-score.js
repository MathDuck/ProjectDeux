const mazoQueryFactory = require("../../factories/mazoQueryFactory");
const { MessageEmbed } = require("discord.js");

module.exports.run = async (client, message, args) => {
  if (message.deletable) message.delete();
  const userMazoData = await mazoQueryFactory
    .selectMazoUserQuery(client)
    .get(message.author.id);

  if (!userMazoData)
    return message
      .reply(`Avant de connaître son score, il faudrait peut-être jouer ;)`)
      .then(msg => msg.delete({ timeout: 3000 }));

  const embed = new MessageEmbed()
    /*.setAuthor(
                message.guild.me.displayName,
                message.guild.me.user.avatarURL()
              )*/
    .setTitle("Mes stats Mazo")
    .setDescription(`Hey **${message.author.tag}**, voici tes stats!`)
    .addField("Score Actuel", userMazoData.current_score, true)
    .addField("Record", userMazoData.top_score, true)
    .setColor("BLUE")
    .setTimestamp();

  message.channel.send({ embed: embed });
};

module.exports.help = {
  name: "mazo-score",
  aliases: ["mscore"],
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
