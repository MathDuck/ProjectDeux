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
    await userQueryFactory
      .registerUserQuery(client)
      .run(
        message.guild.id,
        searchedUser.id,
        searchedUser.user.username + "#" + searchedUser.user.discriminator
      );

    userData = await userQueryFactory
      .selectUserQuery(client)
      .get(searchedUser.id, message.guild.id);
  }

  let pointsToAdd = parseInt(args[1]);
  if (pointsToAdd <= 0) return;

  let totalAddGamePoints = pointsToAdd + userData.game_points;

  await userQueryFactory
    .changeGamePointUserQuery(client)
    .run(totalAddGamePoints, searchedUser.id, message.guild.id);

  const AddEmbed = new MessageEmbed()
    .setAuthor(message.guild.me.displayName, message.guild.me.user.avatarURL())
    .setTitle(
      `Félicitations ${searchedUser.user.username}#${searchedUser.user.discriminator}!`
    )
    .setDescription(`Tu viens de gagner **${pointsToAdd} point(s)** de jeux!`)
    .addField("Total", totalAddGamePoints, true)
    .setColor("#00FF")
    .setTimestamp();
  message.channel.send(`<@${searchedUser.id}>`, {
    embed: AddEmbed
  });
};

module.exports.help = {
  name: "gp-add",
  aliases: ["gamepoints-add", "gp-a"],
  description:
    "Ajoute un nombre de points de jeux spécifié à une personne mentionnée.",
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
