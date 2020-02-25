module.exports.run = async (client, message, args) => {
  if (message.deletable) message.delete();

  const msg = await message.channel.send("Ping...");
  msg.edit(
    `*C'est un Pong 🏓!*\n__**Latence:**__ ${Math.floor(
      msg.createdAt - message.createdAt
    )}ms\n__**Latence BOT:**__ ${client.ws.ping.toFixed(2)}ms`
  );
};

module.exports.help = {
  name: "ping",
  aliases: ["pg", "test"],
  description: "Envoie un ping et le temps de réponse du bot.",
  usage: "<>",
  category: "Divers"
};

module.exports.requirements = {
  userPerms: [],
  clientPerms: [],
  ownerOnly: false
};

module.exports.limits = {
  rateLimit: 2,
  cooldown: 5 * 1000
};
