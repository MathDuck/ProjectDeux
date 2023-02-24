const ticketQueryFactory = require("../../factories/ticketQueryFactory");
const { MessageEmbed } = require("discord.js");

module.exports.run = async (client, message, args) => {
  let ticketData = await ticketQueryFactory
    .checkActiveTicketInCurrentChannelQuery(client)
    .get(message.guild.id, message.channel.id, 1);

  if (message.deletable) message.delete();

  if (!ticketData) return;

  let deleteEmbed = new MessageEmbed();
  deleteEmbed.setTitle(`Suppression du channel...`);
  deleteEmbed.setDescription(
    `Le channel sera supprimé automatiquement dans 5 secondes...`
  );
  deleteEmbed.setColor("RED");

  await message.channel
    .send({ embed: deleteEmbed })
    .then(msg => msg.delete({ timeout: 5000 }));

  await ticketQueryFactory
    .deleteTicketQuery(client)
    .run(message.guild.id, message.channel.id, 1);

  await message.channel.delete();
};

module.exports.help = {
  name: "support-delete",
  aliases: ["s-delete"],
  description: "Supprime le salon d'un ticket fermé ou archivé.",
  usage: "",
  category: "Support"
};

module.exports.requirements = {
  userPerms: ["ADMINISTRATOR"],
  clientPerms: ["ADMINISTRATOR"],
  ownerOnly: false
};

module.exports.limits = {
  rateLimit: 1,
  cooldown: 10 * 1000
};
