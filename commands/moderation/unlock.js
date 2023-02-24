const { MessageEmbed } = require("discord.js");

module.exports.run = async (client, message, args) => {
  if (message.deletable) message.delete();
  const locked = await message.channel.overwritePermissions([
    {
      id: message.channel.guild.id,
      allow: ["SEND_MESSAGES"]
    }
  ]);

  const embed = new MessageEmbed().setDescription(
    locked
      ? "🔓 Ce salon est de nouveau ouvert."
      : "🔓 Ce salon est déjà ouvert."
  );

  return message.channel.send({ embed: embed });
};

module.exports.help = {
  name: "unlock",
  aliases: [],
  description:
    "Ouvre rapidement un salon avec la permission SEND_MESSAGE pour tout le monde.",
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
