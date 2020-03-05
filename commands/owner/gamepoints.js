const serverQueryFactory = require("../../factories/serverQueryFactory");
const userQueryFactory = require("../../factories/userQueryFactory");
const { MessageEmbed } = require("discord.js");

module.exports.run = async (client, message, args) => {
  if (message.deletable) message.delete();

  if (!args[0])
    return message
      .reply(`Y'a pas d'arguments.`)
      .then(m => m.delete({ timeout: 10000 }));

  let serverData = await serverQueryFactory
    .checkDataQuery(client)
    .get(message.guild.id);

  switch (args[0]) {
    case "switch":
      let gameSystemStatus;
      if (serverData.gameSystem === 1) gameSystemStatus = 0;
      else gameSystemStatus = 1;

      await serverQueryFactory
        .updateGameSystemQuery(client)
        .run(gameSystemStatus, message.guild.id);

      message
        .reply(
          "les points de jeux sont " +
            (gameSystemStatus === 1 ? "activés" : "désactivés") +
            " sur le serveur!"
        )
        .then(msg => msg.delete({ timeout: 3000 }));
      break;
    case "add":
      if (serverData.gameSystem === 0)
        return message
          .reply("Le système des points de jeux n'est pas activé...")
          .then(msg => msg.delete({ timeout: 3000 }));

      let searchedUser = message.mentions.members.first();

      if (!searchedUser)
        return message
          .reply("merci de mentionner une personne du serveur!")
          .then(msg => msg.delete({ timeout: 3000 }));

      await userQueryFactory
        .createUserTableQuery(client, message.guild.id)
        .run();

      let userData = await userQueryFactory
        .selectUserQuery(client, message.guild.id)
        .get(searchedUser.id);

      if (!userData) {
        await userQueryFactory
          .registerUserQuery(client, message.guild.id)
          .run(
            message.guild.id,
            searchedUser.id,
            searchedUser.user.username + "#" + searchedUser.user.discriminator
          );

        userData = await userQueryFactory
          .selectUserQuery(client, message.guild.id)
          .get(searchedUser.id);
      }

      let pointsToAdd = parseInt(args[2]);
      if (pointsToAdd <= 0) return;

      let totalAddGamePoints = pointsToAdd + userData.gamePoints;

      await userQueryFactory
        .changeGamePointUserQuery(client, message.guild.id)
        .run(totalAddGamePoints, searchedUser.id);

      const AddEmbed = new MessageEmbed()
        .setAuthor(
          message.guild.me.displayName,
          message.guild.me.user.avatarURL()
        )
        .setDescription(
          `**Félicitations ${searchedUser.user.username}!**\n\nTu viens de gagner **${pointsToAdd} point(s)** de jeux!`
        )
        .addField("Total", totalAddGamePoints, true)
        .setColor("#00FF")
        .setTimestamp();
      message.channel.send(`<@${searchedUser.id}>`, {
        embed: AddEmbed
      });

      message.channel.send(
        `Félicitations <@${searchedUser.id}>! Tu viens de gagner ${pointsToAdd} point(s) de jeux!`
      );

      break;
    case "remove":
      if (serverData.gameSystem === 0)
        return message.reply("C'est pas activé...");

      let searchedUserCheck = message.mentions.members.first();

      if (!searchedUserCheck)
        return message.reply("merci de mentionner une personne du serveur!");

      let userCheckData = await userQueryFactory
        .selectUserQuery(client, message.guild.id)
        .get(searchedUserCheck.id);

      if (!userCheckData) {
        return message.reply("L'utilisateur n'existe pas en BDD.");
      }

      let pointsToRemove = parseInt(args[2]);
      if (pointsToRemove <= 0) return;

      let totalRemoveGamePoints = userCheckData.gamePoints - pointsToRemove;
      if (totalRemoveGamePoints <= 0) totalRemoveGamePoints = 0;

      await userQueryFactory
        .changeGamePointUserQuery(client, message.guild.id)
        .run(totalRemoveGamePoints, searchedUserCheck.id);

      const RemoveEmbed = new MessageEmbed()
        .setAuthor(
          message.guild.me.displayName,
          message.guild.me.user.avatarURL()
        )
        .setDescription(
          `${message.author.username} vient de te retirer **${pointsToRemove} point(s) de jeux**!`
        )
        .addField("Total", totalRemoveGamePoints, true)
        .setColor("RED")
        .setTimestamp();
      message.channel.send(`<@${searchedUserCheck.id}>`, {
        embed: RemoveEmbed
      });

      message.channel.send(
        `<@${searchedUserCheck.id}>, tu viens de perdre ${pointsToRemove} point(s) de jeux...`
      );

      break;
    case "purge":
      await userQueryFactory
        .purgeUsersGamePointsQuery(client, message.guild.id)
        .run();
      message.reply("Tout le monde est revenu à 0 point.");
      break;
  }
};

module.exports.help = {
  name: "gamepoints",
  aliases: ["gp"],
  description: "Commande de gestion des points de jeux",
  usage: "<préfixe>",
  category: "Gestion"
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
