const { MessageEmbed } = require("discord.js");
const ServersTableHandler = require("../../handlers/serversTableHandler")
const xpQueryHandler = require("../../handlers/experienceQueryHandler");

module.exports.run = async(client, message, args) => {
    if (message.deletable) message.delete();

    const globalData = await ServersTableHandler.checkDataQuery(client).get(message.guild.id);
    if (globalData.xpSystem === 1) {
        const sortedUserData = await xpQueryHandler.getSortedUsersQuery(client, message.guild.id).all(message.guild.id, 20);

        let ranking = [];
        let i = 1;

        for (const user of sortedUserData) {
            ranking.push(
                `${i}) **${user.username}** - ${user.xpPoints} XP (Level: ${user.level})\n`
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
        message.reply("le système de gain d'expérience est désactivé.");
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