const { where, botlogChannel } = require("../config");

module.exports = client => {
  console.log(
    `Le bot ${client.user.tag} est en ligne sur ${client.guilds.cache.size} serveurs !`
  );

  /* client.channels
    .fetch(botlogChannel)
    .then(channel =>
      channel.send(`\`\`\`Je suis en ligne sur ${where}!\`\`\``)
    ); */
};
