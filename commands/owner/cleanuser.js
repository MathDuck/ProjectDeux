const xpQueryHandler = require("../../handlers/experienceQueryHandler");
const mazoQueryHandler = require("../../handlers/mazoQueryHandler");

module.exports.run = async(client, message, args) => {
    if (message.deletable) message.delete();

    const allUsers = await xpQueryHandler.getUsersQuery(client, message.guild.id).all(message.guild.id);
    const allMazoUsers = await mazoQueryHandler.queryGetAllMazoUsers(client, message.guild.id).all(message.guild.id);

    const date = new Date();
    const removedUsers = allUsers.filter(data => !message.guild.members.cache.has(data.userId));

    removedUsers.forEach(data => {
        xpQueryHandler.deleteUserQuery(client, message.guild.id).run(message.guild.id, data.userId);
    });

    const removedMazoUsers = allMazoUsers.filter(data => !message.guild.members.cache.has(data.userId));

    removedMazoUsers.forEach(data => {
        mazoQueryHandler.queryDeleteMazoUser(client, message.guild.id).run(message.guild.id, data.userId);
    });

    message.channel.send(`J'ai supprimé ${removedUsers.length} membres.`);
};

module.exports.help = {
    name: "cleanuser",
    aliases: ["clean"],
    description: "Nettoie la base de données en supprimant les enregistrements des personnes qui ne sont plus dans le serveur.",
    usage: "<>",
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