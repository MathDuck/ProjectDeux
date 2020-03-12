const serverQueryFactory = require("../../factories/serverQueryFactory");
const { MessageEmbed } = require("discord.js");

module.exports.run = async (client, message, args) => {
  let serverData = await serverQueryFactory
    .checkDataQuery(client)
    .get(message.guild.id);

  if (message.deletable) message.delete();

  if (!serverData.support_header_message_id)
    return message
      .reply(
        `Impossible de supprimer le salon de support, celui-ci n'étant pas configuré sur un channel.`
      )
      .then(m => m.delete({ timeout: 5000 }));

  let embed = new MessageEmbed();
  embed.setTitle(`Suppression du channel Support`);
  embed.setDescription(
    `Le système de support est maintenant désactivé.\n
    - Vous pouvez maintenant supprimer ce salon, ou tous les messages de ce salon.
    - Vous pouvez recréer un nouveau salon de support avec la commande ${serverData.prefix}s-set.
    - Le tag [ARCHIVES] a été ajouté à la catégorie \`tickets\` (si elle existe encore).\n
    Ce message se supprimera automatiquement dans 15 secondes.`
  );
  embed.setColor("RED");

  if (serverData.tickets_category_channel_id) {
    const category = await message.guild.channels.resolve(
      `${serverData.tickets_category_channel_id}`
    );

    if (category) {
      await category.edit({
        name: `[ARCHIVES] ${category.name}`
      });
    }

    await serverQueryFactory
      .updateTicketsCategoryId(client)
      .run(null, message.guild.id);
  }

  await serverQueryFactory
    .updateSupportMessageHeaderId(client)
    .run(null, message.guild.id);

  await message.channel
    .send({ embed: embed })
    .then(m => m.delete({ timeout: 15000 }));
};

module.exports.help = {
  name: "support-remove",
  aliases: ["s-remove"],
  description: "Supprime le message d'appel pour ouvrir des tickets.",
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
