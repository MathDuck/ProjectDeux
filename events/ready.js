const { where, logChannel } = require("../config");

module.exports = client => {
  console.log(
    `Le bot ${client.user.username}#${client.user.discriminator} est en ligne!`
  );

  client.channels
    .fetch(logChannel)
    .then(channel =>
      channel.send(`\`\`\`Je suis en ligne sur ${where}!\`\`\``)
    );
};
