const serverQueryFactory = require("../../factories/serverQueryFactory");
const { MessageEmbed } = require("discord.js");

module.exports.run = async (client, message, args) => {
  if (message.deletable) message.delete();

  let serverData = await serverQueryFactory
    .checkDataQuery(client)
    .get(message.guild.id);

  let firstEmbed = new MessageEmbed();
  firstEmbed.setTitle(`Activation du channel Support`);
  firstEmbed.setDescription(
    `Le système de support est maintenant activé.\n
    - Toutes les personnes qui ajouteront une réaction sur l'émoji 🎫 ouvriront un nouveau ticket.
    - Vous pouvez désactiver le support en faisant la commande ${serverData.prefix}s-remove.
    - Une catégorie \`tickets\` (si elle n'existe pas) a été créée automatiquement sur la gauche. Vous pouvez la déplacer où bon vous semble.\n
    Ce message se supprimera automatiquement dans 15 secondes.`
  );
  firstEmbed.setColor("GREEN");

  let secondEmbed = new MessageEmbed();
  secondEmbed.setTitle(`Support Ticket`);
  secondEmbed.setDescription(`Clique sur 🎫 pour contacter le support!`);
  secondEmbed.setColor("CYAN");

  let categoryId;
  if (!serverData.tickets_category_channel_id) {
    const newCategory = await message.guild.channels.create(`tickets`, {
      type: "category",
      permissionOverwrites: [
        {
          id: message.guild.id,
          deny: ["VIEW_CHANNEL"]
        }
      ],
      position: 2,
      reason: "Auto-Création d'une catégorie pour les tickets."
    });

    categoryId = newCategory.id;
  } else categoryId = serverData.tickets_category_channel_id;

  await serverQueryFactory
    .updateTicketsCategoryId(client)
    .run(categoryId, message.guild.id);

  message.channel
    .send({ embed: firstEmbed })
    .then(m => m.delete({ timeout: 15000 }));

  await message.channel.send({ embed: secondEmbed }).then(m =>
    m.react("🎫").then(m => {
      serverQueryFactory
        .updateSupportMessageHeaderId(client)
        .run(m.message.id, message.guild.id);
    })
  );
};

module.exports.help = {
  name: "support-set",
  aliases: ["s-set"],
  description: "Active le message d'appel pour ouvrir des tickets.",
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
