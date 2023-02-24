const { MessageEmbed } = require("discord.js");

module.exports.run = async (client, message, args) => {
  if (message.deletable) message.delete();
  await message.channel.overwritePermissions([
    {
      id: message.channel.guild.id,
      deny: ["SEND_MESSAGES"]
    }
  ]);

  const embed = new MessageEmbed().setDescription(
    `🔒 Ce salon est maintenant fermé.`
  );

  return message.channel.send({ embed: embed });
};

module.exports.help = {
  name: "lock",
  aliases: ["lockdown"],
  description:
    "Ferme rapidement un salon et supprime les permissions de celui-ci.",
  usage: "",
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
