const mazoQueryFactory = require("../../factories/mazoQueryFactory");
const serverQueryFactory = require("../../factories/serverQueryFactory");
const { MessageEmbed } = require("discord.js");

module.exports.run = async (client, message, args) => {
  let serverData = await serverQueryFactory
    .checkDataQuery(client)
    .get(message.guild.id);

  let mazoEnabled = 0;
  let mazoConfigured = 0;

  if (!serverData || !serverData.mazo_configured) {
    if (message.deletable) message.delete();
    mazoConfigured = 0;
    return message
      .reply(
        `le mazo n'est pas configuré. Tapez \`${serverData.prefix}mazo-set\` pour le configurer si vous avez les droits d'administrateur.`
      )
      .then(msg => msg.delete({ timeout: 5000 }));
  } else {
    if (serverData.mazo_configured === 1) mazoConfigured = 1;
  }

  if (!serverData || !serverData.mazo_enabled) {
    if (message.deletable) message.delete();
    mazoEnabled = 0;
    return message
      .reply(
        `le mazo n'est pas activé. Tapez \`${serverData.prefix}mazo-switch\` pour l'activer si vous avez les droits d'administrateur.`
      )
      .then(msg => msg.delete({ timeout: 5000 }));
  } else {
    if (serverData.mazo_enabled === 1) mazoEnabled = 1;
    else mazoEnabled = 0;
  }

  if (mazoConfigured === 1) {
    if (mazoEnabled === 1) {
      if (message.deletable) message.delete();

      let userMazoData = mazoQueryFactory
        .selectMazoUserQuery(client)
        .get(message.author.id);

      if (!userMazoData) {
        await mazoQueryFactory
          .registerMazoUserQuery(client)
          .run(message.guild.id, message.author.id, message.author.tag);

        userMazoData = await mazoQueryFactory
          .selectMazoUserQuery(client)
          .get(message.author.id);
      }

      const username = message.author.tag;
      let userCurrentScore = userMazoData.current_score;
      let userTopScore = userMazoData.top_score;

      const MazoChance = Math.random();

      if (MazoChance > 0.5) {
        userCurrentScore++;

        const embed = new MessageEmbed()
          /*.setAuthor(
              message.guild.me.displayName,
              message.guild.me.user.avatarURL()
            )*/
          .setTitle(`The MAZO Game`)
          .setDescription(
            `Bravo **${username}!**\n\nTu gagnes **1** point Mazo!`
          )
          .addField("**Score Actuel**", userCurrentScore, true)
          .addField("**Record Perso**", userTopScore, true)
          .setColor("GREEN")
          .setTimestamp();
        message.channel.send({ embed: embed });

        mazoQueryFactory
          .updateMazoCurrentScoreUserQuery(client)
          .run(userCurrentScore, message.author.id, message.guild.id);

        if (userCurrentScore > userTopScore) {
          const previousTopScore = userTopScore;
          userTopScore = userCurrentScore;

          const embed = new MessageEmbed()
            /*.setAuthor(
                message.guild.me.displayName,
                message.guild.me.user.avatarURL()
              )*/
            .setTitle(`The MAZO Game`)
            .setDescription(
              `Super **${username}!**\n\nTu viens de battre ton précédent record qui était de **${previousTopScore}** point(s) Mazo!`
            )
            .addField("**Nouveau Record**", userTopScore, true)
            .setColor("CYAN")
            .setTimestamp();
          message.channel.send({ embed: embed });

          mazoQueryFactory
            .updateMazoTopScoreUserQuery(client)
            .run(userTopScore, message.author.id, message.guild.id);
        }
      } else {
        let loseMessage;
        if (userCurrentScore < 1)
          loseMessage = `Perdu **${username}!**\n\nTu restes à 0... *Retente ta chance.*`;
        else
          loseMessage = `Oh non c'est perdu **${username}**!\n\n*Tu repars de 0...*`;

        const embed = new MessageEmbed()
          /*.setAuthor(
              message.guild.me.displayName,
              message.guild.me.user.avatarURL()
            )*/
          .setTitle(`The MAZO Game`)
          .setDescription(loseMessage)
          .addField("**Record Perso**", userTopScore)
          .setColor("RED")
          .setTimestamp();
        message.channel.send({ embed: embed });

        mazoQueryFactory
          .updateMazoCurrentScoreUserQuery(client)
          .run(0, message.author.id, message.guild.id);
      }
    }
  }
};

module.exports.help = {
  name: "mazo",
  description: "Le célèbre jeu MAZO de Math'.",
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
