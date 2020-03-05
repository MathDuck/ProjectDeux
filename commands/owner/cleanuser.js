const userQueryFactory = require("../../factories/userQueryFactory");
const mazoQueryFactory = require("../../factories/mazoQueryFactory");

module.exports.run = async (client, message, args) => {
  if (message.deletable) message.delete();

  const allUsers = await userQueryFactory
    .getUsersQuery(client, message.guild.id)
    .all(message.guild.id);
  const allMazoUsers = await mazoQueryFactory
    .getAllMazoUsersQuery(client, message.guild.id)
    .all(message.guild.id);

  const removedUsers = allUsers.filter(
    data => !message.guild.members.cache.has(data.userId)
  );

  removedUsers.forEach(data => {
    userQueryFactory
      .deleteUserQuery(client, message.guild.id)
      .run(message.guild.id, data.userId);
  });

  const removedMazoUsers = allMazoUsers.filter(
    data => !message.guild.members.cache.has(data.userId)
  );

  removedMazoUsers.forEach(data => {
    mazoQueryFactory
      .deleteMazoUserQuery(client, message.guild.id)
      .run(message.guild.id, data.userId);
  });

  message.channel.send(`J'ai supprimé ${removedUsers.length} membres.`);
};

module.exports.help = {
  name: "clean",
  aliases: ["cleanuser"],
  description:
    "Nettoie la base de données en supprimant les enregistrements des personnes qui ne sont plus dans le serveur.",
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
