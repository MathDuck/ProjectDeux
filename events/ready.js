const {
  where,
  botActivityStatus,
  botActivityType,
  botStatus,
  logChannel
} = require("../config");

module.exports = client => {
  console.log(
    `Le bot ${client.user.username}#${client.user.discriminator} est en ligne!`
  );

  client.user.setPresence({
    activity: { name: botActivityStatus, type: botActivityType },
    status: botStatus
  });

  client.channels
    .fetch(logChannel)
    .then(channel => channel.send("```Je suis en ligne sur " + where + "!```"));
};
