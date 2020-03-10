const userQueryFactory = require("../../factories/userQueryFactory");
const mazoQueryFactory = require("../../factories/mazoQueryFactory");

module.exports.run = async (client, message, args) => {
  if (message.deletable) message.delete();

  const allUsers = await userQueryFactory
    .getUsersQuery(client)
    .all(message.guild.id);
  const allMazoUsers = await mazoQueryFactory
    .getAllMazoUsersQuery(client)
    .all(message.guild.id);

  const removedUsers = allUsers.filter(
    data => !message.guild.members.cache.has(data.user_id)
  );

  removedUsers.forEach(data => {
    userQueryFactory
      .deleteUserQuery(client)
      .run(message.guild.id, data.user_id);
  });

  const removedMazoUsers = allMazoUsers.filter(
    data => !message.guild.members.cache.has(data.user_id)
  );

  removedMazoUsers.forEach(data => {
    mazoQueryFactory
      .deleteMazoUserQuery(client)
      .run(message.guild.id, data.user_id);
  });

  message
    .reply(
      `j'ai supprimé ${removedUsers.length} membres de la base de données.`
    )
    .then(m => m.delete({ timeout: 5000 }));
};

module.exports.help = {
  name: "clean",
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
