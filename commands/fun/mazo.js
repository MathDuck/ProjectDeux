const mazoQueryHandler = require("../../handlers/mazoQueryHandler");
const { MessageEmbed } = require("discord.js");

module.exports.run = async (client, message, args) => {
  let data = await mazoQueryHandler
    .querySelectServer(client)
    .get(message.guild.id);

  if (args[0] === "set") {
    if (message.deletable) message.delete();
    if (!message.member.permissions.has("ADMINISTRATOR"))
      return message
        .reply("seul un administrateur peut activer ou désactiver le mazo.")
        .then(msg => msg.delete({ timeout: 4000 }));

    if (!data)
      await mazoQueryHandler.queryInsertServer(client).run(message.guild.id, 1);
    else
      await mazoQueryHandler.queryUpdateServer(client).run(1, message.guild.id);

    mazoQueryHandler.queryCreateMazoTable(client, message.guild.id).run();

    client.mazoEnabled = 1;

    return message
      .reply("le mazo est dorénavant configuré.")
      .then(msg => msg.delete({ timeout: 4000 }));
  }

  if (!data) {
    if (message.deletable) message.delete();
    client.mazoEnabled = 0;
    return message.reply(
      `le mazo n'est pas configuré. Tapez \`${
        client.prefix[message.guild.id]
      }mazo set\` pour le configurer.`
    );
  } else {
    if (data.mazoEnabled === 1) client.mazoEnabled = 1;
    else client.mazoEnabled = 0;
  }

  if (args[0] === "enable") {
    if (message.deletable) message.delete();
    if (!message.member.permissions.has("ADMINISTRATOR"))
      return message
        .reply("seul un administrateur peut activer ou désactiver le mazo.")
        .then(msg => msg.delete({ timeout: 4000 }));

    let mazoStatus;
    if (data.mazoEnabled === 1) mazoStatus = 0;
    else mazoStatus = 1;

    await mazoQueryHandler
      .queryUpdate(client)
      .run(mazoStatus, message.guild.id);
    client.mazoEnabled = mazoStatus;

    return message
      .reply(
        "le mazo est " +
          (mazoStatus === 1 ? "activé" : "désactivé") +
          " sur le serveur!"
      )
      .then(msg => msg.delete({ timeout: 3000 }));
  }

  if (client.mazoEnabled === 1) {
    if (!args[0]) {
      if (message.deletable) message.delete();

      let userData = mazoQueryHandler
        .querySelectMazoUser(client, message.guild.id)
        .get(message.author.id);

      if (!userData) {
        await mazoQueryHandler
          .queryRegisterMazoUser(client, message.guild.id)
          .run(message.guild.id, message.author.id, message.author.tag, 0, 0);

        userData = mazoQueryHandler
          .querySelectMazoUser(client, message.guild.id)
          .get(message.author.id);
      }

      const username = message.author.tag;
      let userCurrentScore = userData.currentscore;
      let userTopScore = userData.topscore;

      const MazoChance = Math.random();

      if (MazoChance > 0.5) {
        userCurrentScore++;

        const embed = new MessageEmbed()
          .setAuthor(
            message.guild.me.displayName,
            message.guild.me.user.avatarURL()
          )
          .setTitle(`The MAZO Game`)
          .setDescription(
            `Bravo **${username}!**\n\n*Tu gagnes un point Mazo!*`
          )
          .addField("**Score Actuel**", userCurrentScore, true)
          .addField("**Record Perso**", userTopScore, true)
          .setColor("GREEN")
          .setTimestamp();
        message.channel.send({ embed: embed });

        mazoQueryHandler
          .queryUpdateMazoCurrentScoreUser(client, message.guild.id)
          .run(userCurrentScore, message.author.id, message.guild.id);

        if (userCurrentScore > userTopScore) {
          const previousTopScore = userTopScore;
          userTopScore = userCurrentScore;

          const embed = new MessageEmbed()
            .setAuthor(
              message.guild.me.displayName,
              message.guild.me.user.avatarURL()
            )
            .setTitle(`The MAZO Game`)
            .setDescription(
              `Super **${username}!**\n\n*Tu viens de battre ton précédent record qui était de ${previousTopScore}!*`
            )
            .addField("**Nouveau Record**", userTopScore, true)
            .setColor("CYAN")
            .setTimestamp();
          message.channel.send({ embed: embed });

          mazoQueryHandler
            .queryUpdateMazoTopScoreUser(client, message.guild.id)
            .run(userTopScore, message.author.id, message.guild.id);
        }
      } else {
        let loseMessage;
        if (userCurrentScore < 1)
          loseMessage = `Perdu **${username}!**\n\n*Tu restes à 0... Retente ta chance.*`;
        else
          loseMessage = `Oh non c'est perdu **${username}**!\n\n*Tu repars de 0...*`;

        const embed = new MessageEmbed()
          .setAuthor(
            message.guild.me.displayName,
            message.guild.me.user.avatarURL()
          )
          .setTitle(`The MAZO Game`)
          .setDescription(loseMessage)
          .addField("**Record Perso**", userTopScore)
          .setColor("RED")
          .setTimestamp();
        message.channel.send({ embed: embed });

        mazoQueryHandler
          .queryUpdateMazoCurrentScoreUser(client, message.guild.id)
          .run(0, message.author.id, message.guild.id);
      }
    } else {
      switch (args[0]) {
        case "score":
          break;
        case "rank":
          break;
        default:
          //Faire un help avec liste des arguments
          message.reply("merci d'utiliser un argument valide");
          break;
      }
    }
  } else {
    return message.reply("le mazo est désactivé.");
  }
};

module.exports.help = {
  name: "mazo",
  aliases: [],
  description: "Le célèbre jeu MAZO de Math'.",
  usage: "<enable>/<NoArgs>/<score>/<rank>",
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
