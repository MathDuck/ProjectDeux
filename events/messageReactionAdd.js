const serverQueryFactory = require("../factories/serverQueryFactory");
const ticketQueryFactory = require("../factories/ticketQueryFactory");
const { MessageEmbed } = require("discord.js");

module.exports = async (client, reaction, user) => {
  if (user.bot) return;

  if (reaction.message.partial) {
    await reaction.message.fetch();
    console.log("Mise en cache d'un ancien message.");
  }

  if (reaction.partial) {
    await reaction.fetch();
    console.log("Mise en cache d'une réaction.");
  }

  let serverData = await serverQueryFactory
    .checkDataQuery(client)
    .get(reaction.message.guild.id);

  if (serverData.support_system === 1) {
    let ticketDataByHeaderId = await ticketQueryFactory
      .checkTicketDataByHeaderIdQuery(client)
      .get(reaction.message.id);

    if (ticketDataByHeaderId) {
      if (
        ticketDataByHeaderId.ticket_header_message_id === reaction.message.id
      ) {
        let ticketId = String(ticketDataByHeaderId.id).padStart(4, "0");
        if (reaction.emoji.name === "🛑") {
          if (ticketDataByHeaderId.resolved === 0) {
            const channel = reaction.message.channel;
            let resolvedEmbed = new MessageEmbed();
            resolvedEmbed.setTitle(
              `Le ticket #${ticketId} a été fermé par ${user.tag}.`
            );
            resolvedEmbed.setDescription(
              `Le ticket #${ticketId} est maintenant fermé.\nOuvre en un nouveau si tu as besoin.\n\n*__Note:__ Le ticket sera toujours accessible tant qu'un admin ou la personne ayant créé le ticket ne le supprime pas via le tableau de bord épinglé.*`
            );
            resolvedEmbed.setColor("YELLOW");
            resolvedEmbed.setTimestamp();

            await channel.send({ embed: resolvedEmbed });
            await channel.overwritePermissions([
              {
                id: reaction.message.guild.id,
                deny: ["VIEW_CHANNEL"]
              },
              {
                id: ticketDataByHeaderId.user_id,
                allow: ["VIEW_CHANNEL"],
                deny: [
                  "SEND_MESSAGES",
                  "ADD_REACTIONS",
                  "MANAGE_MESSAGES",
                  "MENTION_EVERYONE"
                ]
              }
            ]);

            if (ticketDataByHeaderId.archived === 0) {
              await channel.edit({ name: "closed-" + channel.name });
            }

            let resolvedAdminEmbed = new MessageEmbed();
            resolvedAdminEmbed.setTitle(`Info Admin`);
            resolvedAdminEmbed.setDescription(
              `*Vous pouvez maintenant supprimer le salon et le ticket proprement en tapant la commande \`${serverData.prefix}s-delete\`.*`
            );
            resolvedAdminEmbed.setColor("CYAN");
            resolvedAdminEmbed.setTimestamp();

            await channel.send({ embed: resolvedAdminEmbed });

            await ticketQueryFactory
              .resolveTicketQuery(client)
              .run("1", reaction.message.id);
          }
        } else if (reaction.emoji.name === "❌") {
          if (ticketDataByHeaderId.archived === 0) {
            const channel = reaction.message.channel;
            const member = reaction.message.guild.members.resolve(
              ticketDataByHeaderId.user_id
            );

            let resolvedEmbed = new MessageEmbed();
            resolvedEmbed.setTitle(
              `Le ticket #${ticketId} a été fermé et archivé par ${user.tag}.`
            );
            resolvedEmbed.setDescription(
              `Le ticket #${ticketId} est maintenant fermé et archivé.\nSans droits, ${member.user.username}#${member.user.discriminator} n'aura plus accès à ce channel.\n\n*Pour totalement supprimer le ticket et ce channel, tapez la commande \`${serverData.prefix}s-delete\`.*`
            );
            resolvedEmbed.setColor("YELLOW");
            resolvedEmbed.setTimestamp();

            await channel.send({ embed: resolvedEmbed });
            await channel.overwritePermissions([
              {
                id: reaction.message.guild.id,
                deny: ["VIEW_CHANNEL"]
              },
              {
                id: ticketDataByHeaderId.user_id,
                deny: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
              }
            ]);

            if (ticketDataByHeaderId.resolved === 1) {
              await channel.edit({
                name: `${channel.name.replace("closed", "archived")}`
              });
            } else
              await channel.edit({
                name: `archived-${channel.name}`
              });

            await ticketQueryFactory
              .resolveAndArchiveTicketQuery(client)
              .run("1", "1", reaction.message.id);
          }
          return;
        }
      }
    }

    if (serverData.support_header_message_id === reaction.message.id) {
      let ticketData = await ticketQueryFactory
        .checkActiveTicketDataQuery(client)
        .get(user.id, reaction.message.guild.id, 0);

      if (ticketData) {
        reaction.message.channel
          .send(
            `${user}, tu as déjà un ticket en attente dans le salon <#${ticketData.channel_id}>`
          )
          .then(m => m.delete({ timeout: 10000 }));
        return;
      }

      if (reaction.emoji.name === "🎫") {
        const newTicket = await ticketQueryFactory
          .addTicketDataQuery(client)
          .run(reaction.message.guild.id, user.id, user.username, 0, 0);

        let ticketId = String(newTicket.lastInsertRowid).padStart(4, "0");

        const ticketChannel = await reaction.message.guild.channels.create(
          `ticket-${ticketId}`,
          {
            type: "text",
            parent: serverData.tickets_category_channel_id,
            permissionOverwrites: [
              {
                id: reaction.message.guild.id,
                deny: ["VIEW_CHANNEL"]
              },
              {
                id: user.id,
                allow: [
                  "VIEW_CHANNEL",
                  "SEND_MESSAGES",
                  "READ_MESSAGE_HISTORY"
                ],
                deny: ["ADD_REACTIONS", "MANAGE_MESSAGES", "MENTION_EVERYONE"]
              }
            ],
            reason: `Création du ticket n°${ticketId}`
          }
        );

        let boardEmbed = new MessageEmbed();
        boardEmbed.setTitle(`Ticket #${ticketId} - ${user.tag}`);
        boardEmbed.setDescription(
          `*__Note:__\n- Clique sur 🛑 pour fermer le ticket.\n- Clique sur ❌ pour fermer et archiver le ticket.*\n
        **Hello ${user}, que peut-on faire pour toi ?**`
        );
        boardEmbed.setColor("GREEN");
        boardEmbed.setTimestamp();

        await ticketChannel.send({ embed: boardEmbed }).then(msg => {
          msg.react("🛑");
          msg.react("❌");
          msg.pin();

          const timestamp = new Date().getTime().toString();
          ticketQueryFactory
            .updateTicketDataQuery(client)
            .run(msg.channel.id, msg.id, timestamp, user.id, msg.guild.id, 0);
        });
      }
    }
  } else {
    reaction.message.channel
      .send(`${user}, le support est actuellement désactivé.`)
      .then(m => m.delete({ timeout: 8000 }));
  }
};
