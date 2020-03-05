module.exports.run = async (client, message, args) => {
  if (message.deletable) message.delete();
  try {
    await client.user.setPresence({
      activity: { name: "" },
      status: "offline"
    });
    await message
      .reply(`le bot redémarre`)
      .then(msg => msg.delete({ timeout: 5000 }));
    process.exit(1);
  } catch (e) {
    console.log(e);
  }
};

module.exports.help = {
  name: "restart",
  description: "Redémarre le bot entièrement.",
  usage: "<>",
  category: "Système"
};

module.exports.requirements = {
  userPerms: ["ADMINISTRATOR"],
  clientPerms: ["ADMINISTRATOR"],
  ownerOnly: true
};

module.exports.limits = {
  rateLimit: 1,
  cooldown: 20 * 1000
};
