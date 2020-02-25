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
  description: "Redémarre le bot entièrement",
  category: "Système"
};

module.exports.requirements = {
  userPerms: ["ADMINISTRATOR"],
  clientPerms: ["ADMINISTRATOR"],
  ownerOnly: false
};

module.exports.limits = {
  rateLimit: 2,
  cooldown: 5 * 1000
};
