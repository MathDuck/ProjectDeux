module.exports.run = async (client, message, args) => {
  if (!args[0])
    return message
      .reply("Merci de spécifier un argument (Pseudo/Nombre).")
      .then(m => m.delete({ timeout: 5000 }));

  if (isNaN(args[0])) {
    const member =
      message.guild.members.cache.get(args[0]) ||
      message.mentions.members.first();

    if (!member) {
      message
        .reply(`Le pseudo spécifié est introuvable.`)
        .then(m => m.delete({ timeout: 3000 }));
      return;
    }
    try {
      await message.delete();
      message.channel.messages.fetch({ limit: 100 }).then(messages => {
        const filtered = messages.filter(msg => msg.author.id === member.id);
        message.channel.bulkDelete(filtered);
        message.channel
          .send(`**${filtered.size} messages ont été supprimés.**`)
          .then(msg => msg.delete({ timeout: 3000 }));
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    let amount = parseInt(args[0]);
    if (amount <= 0) return;

    if (amount > 100) amount = 100;

    try {
      await message.delete();
      message.channel.messages.fetch({ limit: amount }).then(messages => {
        message.channel.bulkDelete(messages);
        message.channel
          .send(`**${amount} messages ont été supprimés.**`)
          .then(msg => msg.delete({ timeout: 3000 }));
      });
    } catch (e) {
      console.log(e);
    }
  }
};

module.exports.help = {
  name: "purge",
  aliases: ["clear"],
  description: "Supprime un nombre défini de messages.",
  usage: "<nombre>/<pseudo>",
  category: "Modération"
};

module.exports.requirements = {
  userPerms: ["MANAGE_MESSAGES"],
  clientPerms: ["MANAGE_MESSAGES"],
  ownerOnly: false
};

module.exports.limits = {
  rateLimit: 1,
  cooldown: 10 * 1000
};
