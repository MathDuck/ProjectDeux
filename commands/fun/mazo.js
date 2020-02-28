const mazoQueryHandler = require("../../handlers/mazoQueryHandler");
const { MessageEmbed } = require("discord.js");

module.exports.run = async(client, message, args) => {
    let mazoData = await mazoQueryHandler
        .querySelectServer(client)
        .get(message.guild.id);

    if (args[0] === "set") {
        if (message.deletable) message.delete();
        if (!message.member.permissions.has("ADMINISTRATOR"))
            return message
                .reply("seul un administrateur peut configurer le mazo.")
                .then(msg => msg.delete({ timeout: 4000 }));

        if (mazoData.mazoConfigured === 1)
            return message
                .reply("le mazo est déjà configuré sur le serveur.")
                .then(msg => msg.delete({ timeout: 4000 }));
        else
            await mazoQueryHandler
            .queryUpdateServer(client)
            .run(1, 1, message.guild.id);

        client.mazoEnabled = 1;
        client.mazoConfigured = 1;

        mazoQueryHandler.queryCreateMazoTable(client, message.guild.id).run();

        return message
            .reply("le mazo est dorénavant configuré et activé.")
            .then(msg => msg.delete({ timeout: 4000 }));
    }

    if (!mazoData || !mazoData.mazoConfigured) {
        if (message.deletable) message.delete();
        client.mazoConfigured = 0;
        return message
            .reply(
                `le mazo n'est pas configuré. Tapez \`${client.prefix}mazo set\` pour le configurer si vous avez les droits d'administrateur.`
            )
            .then(msg => msg.delete({ timeout: 5000 }));
    } else {
        if (mazoData.mazoConfigured === 1) client.mazoConfigured = 1;
    }

    if (args[0] === "switch") {
        if (message.deletable) message.delete();
        if (!message.member.permissions.has("ADMINISTRATOR"))
            return message
                .reply("seul un administrateur peut activer ou désactiver le mazo.")
                .then(msg => msg.delete({ timeout: 4000 }));

        let mazoStatus;
        if (mazoData.mazoEnabled === 1) mazoStatus = 0;
        else mazoStatus = 1;

        await mazoQueryHandler
            .queryUpdateServer(client)
            .run(mazoStatus, client.mazoConfigured, message.guild.id);
        client.mazoEnabled = mazoStatus;

        return message
            .reply(
                "le mazo est " +
                (mazoStatus === 1 ? "activé" : "désactivé") +
                " sur le serveur!"
            )
            .then(msg => msg.delete({ timeout: 3000 }));
    }

    if (!mazoData || !mazoData.mazoEnabled) {
        if (message.deletable) message.delete();
        client.mazoEnabled = 0;
        return message
            .reply(
                `le mazo n'est pas activé. Tapez \`${client.prefix}mazo switch\` pour l'activer si vous avez les droits d'administrateur.`
            )
            .then(msg => msg.delete({ timeout: 5000 }));
    } else {
        if (mazoData.mazoEnabled === 1) client.mazoEnabled = 1;
        else client.mazoEnabled = 0;
    }

    if (client.mazoConfigured === 1) {
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

                    userData = await mazoQueryHandler
                        .querySelectMazoUser(client, message.guild.id)
                        .get(message.author.id);
                }

                const username = message.author.tag;
                let userCurrentScore = userData.currentScore;
                let userTopScore = userData.topScore;

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
                            `Bravo **${username}!**\n\nTu gagnes **1** point Mazo!`
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
                                `Super **${username}!**\n\nTu viens de battre ton précédent record qui était de **${previousTopScore}** point(s) Mazo!`
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
                        loseMessage = `Perdu **${username}!**\n\nTu restes à 0... *Retente ta chance.*`;
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
                        if (message.deletable) message.delete();
                        const userData = mazoQueryHandler
                            .querySelectMazoUser(client, message.guild.id)
                            .get(message.author.id);

                        if (!userData)
                            return message
                                .reply(
                                    `Avant de connaître son score, il faudrait peut-être jouer ;)`
                                )
                                .then(msg => msg.delete({ timeout: 3000 }));

                        const embed = new MessageEmbed()
                            .setAuthor(
                                message.guild.me.displayName,
                                message.guild.me.user.avatarURL()
                            )
                            .setTitle("Mes stats Mazo")
                            .setDescription(`Hey **${message.author.tag}**, voici tes stats!`)
                            .addField("Score Actuel", userData.currentScore, true)
                            .addField("Record", userData.topScore, true)
                            .setColor("BLUE")
                            .setTimestamp();

                        message.channel.send({ embed: embed });
                        break;
                    case "rank":
                        if (message.deletable) message.delete();
                        const globalData = mazoQueryHandler
                            .queryGetMazoData(client, message.guild.id)
                            .all(message.guild.id, 12);

                        if (!globalData)
                            return message
                                .reply(`Il n'y a aucun classement sur ce serveur`)
                                .then(msg => msg.delete({ timeout: 3000 }));

                        let ranking = [];
                        let i = 1;

                        for (const cat of globalData) {
                            ranking.push(
                                `${i}) **${cat.username}** - ${cat.topScore} Point(s) Mazo\n`
                            );
                            i++;
                        }

                        const rankingEmbed = new MessageEmbed()
                            .setAuthor(
                                message.guild.me.displayName,
                                message.guild.me.user.avatarURL()
                            )
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
                        break;
                    default:
                        if (message.deletable) message.delete();
                        const helpEmbed = new MessageEmbed()
                            .setAuthor(
                                message.guild.me.displayName,
                                message.guild.me.user.avatarURL()
                            )
                            .setTitle("Commandes MAZO")
                            .setDescription(
                                `Hey **${message.author.tag}**, voici les commandes du Mazo!`
                            )
                            .addField(
                                `**${client.prefix}mazo set**`,
                                "*Initialise le mazo. (Commande admin)*"
                            )
                            .addField(
                                `**${client.prefix}mazo**`,
                                "*Lance une session.*"
                            )
                            .addField(
                                `**${client.prefix}mazo switch**`,
                                "*Permet d'activer/de désactiver le mazo.*"
                            )
                            .addField(
                                `**${client.prefix}mazo score**`,
                                "*Donne son score.*"
                            )
                            .addField(
                                `**${client.prefix}mazo rank**`,
                                "*Retourne le classement général.*"
                            )
                            .setColor("BLUE")
                            .setTimestamp();
                        message.channel.send({ embed: helpEmbed });
                        break;
                }
            }
        }
    }
};

module.exports.help = {
    name: "mazo",
    aliases: [],
    description: "Le célèbre jeu MAZO de Math'.",
    usage: "<switch>/<score>/<rank>",
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