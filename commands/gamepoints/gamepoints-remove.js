const serverQueryFactory = require("../../factories/serverQueryFactory");
const userQueryFactory = require("../../factories/userQueryFactory");
const { MessageEmbed } = require("discord.js");

module.exports.run = async (client, message, args) => {
  if (message.deletable) message.delete();

  if (!args[0])
    return message
      .reply(`il manque des arguments.`)
      .then(m => m.delete({ timeout: 5000 }));

  let serverData = await serverQueryFactory
    .checkDataQuery(client)
    .get(message.guild.id);

  if (serverData.game_system === 0)
    return message
      .reply("le système des points de jeux n'est pas activé...")
      .then(msg => msg.delete({ timeout: 3000 }));

  let searchedUser = message.mentions.members.first();

  if (!searchedUser)
    return message
      .reply("merci de mentionner une personne qui fait partie du serveur!")
      .then(msg => msg.delete({ timeout: 3000 }));

  let userData = await userQueryFactory
    .selectUserQuery(client)
    .get(searchedUser.id, message.guild.id);

  if (!userData) {
    return message
      .reply("L'utilisateur n'existe pas en BDD.")
      .then(m => m.delete({ timeout: 4000 }));
  }

  let pointsToRemove = parseInt(args[1]);
  if (pointsToRemove <= 0) return;

  let totalRemoveGamePoints = userData.game_points - pointsToRemove;
  if (totalRemoveGamePoints <= 0) totalRemoveGamePoints = 0;

  await userQueryFactory
    .changeGamePointUserQuery(client)
    .run(totalRemoveGamePoints, searchedUser.id, message.guild.id);

  const RemoveEmbed = new MessageEmbed()
    .setAuthor(message.guild.me.displayName, message.guild.me.user.avatarURL())
    .setTitle(
      `Désolé ${searchedUser.user.username}#${searchedUser.user.discriminator}...`
    )
    .setDescription(
      `${message.author.tag} vient de te retirer **${pointsToRemove} point(s) de jeux**!`
    )
    .addField("Total", totalRemoveGamePoints, true)
    .setColor("RED")
    .setTimestamp();
  message.channel.send(`<@${searchedUser.id}>`, {
    embed: RemoveEmbed
  });
};

module.exports.help = {
  name: "gp-remove",
  aliases: ["gamepoints-remove", "gp-r"],
  description:
    "Retire un nombre de points de jeux spécifié à une personne mentionnée.",
  usage: "<@pseudo> <nombre>",
  category: "GamePoints"
};

module.exports.requirements = {
  userPerms: ["ADMINISTRATOR"],
  clientPerms: [],
  ownerOnly: false
};

module.exports.limits = {
  rateLimit: 1,
  cooldown: 30 * 1000
};
