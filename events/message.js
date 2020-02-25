const { owners } = require("../config");

module.exports = async (client, message) => {
  if (message.author.bot) return;

  console.log(
    `Message reçu: "${message.content}" de ${message.author.username}`
  );

  if (!message.content.startsWith(client.prefix)) return;

  const args = message.content.split(/ +/g);
  const command = args
    .shift()
    .slice(client.prefix.length)
    .toLowerCase();

  if (command.length === 0) return;
  let cmd = client.commands.get(command);
  if (!cmd) cmd = client.commands.get(client.aliases.get(command));
  if (!cmd) return;

  if (!message.guild.me.permissions.has(["SEND_MESSAGES"])) return;

  if (cmd.requirements.ownerOnly && !owners.includes(message.author.id))
    return message
      .reply("seul un propriétaire du bot peut utiliser cette commande!")
      .then(msg => msg.delete({ timeout: 2000 }));

  if (
    cmd.requirements.userPerms &&
    !message.member.permissions.has(cmd.requirements.userPerms)
  )
    return message
      .reply(
        `tu dois avoir les permissions suivantes pour exécuter cette commande: ${missingPerms(
          message.member,
          cmd.requirements.userPerms
        )}`
      )
      .then(msg => msg.delete({ timeout: 5000 }));

  if (
    cmd.requirements.clientPerms &&
    !message.guild.me.permissions.has(cmd.requirements.clientPerms)
  )
    return message
      .reply(
        `je n'ai pas les permissions suivantes pour exécuter cette commande: ${missingPerms(
          message.guild.me,
          cmd.requirements.clientPerms
        )}`
      )
      .then(msg => msg.delete({ timeout: 5000 }));

  if (cmd.limits && !message.member.permissions.has("ADMINISTRATOR")) {
    const current = client.limits.get(`${command}-${message.author.id}`);
    if (!current) client.limits.set(`${command}-${message.author.id}`, 1);
    else {
      if (current >= cmd.limits.rateLimit) {
        if (message.deletable) message.delete();
        return message
          .reply("évite de spammer ;)")
          .then(msg => msg.delete({ timeout: 3000 }));
      }
      client.limits.set(`${command}-${message.author.id}`, current + 1);
    }

    setTimeout(() => {
      client.limits.delete(`${command}-${message.author.id}`);
    }, cmd.limits.cooldown);
  }

  if (cmd) cmd.run(client, message, args);
};

const missingPerms = (member, perms) => {
  const missingPerms = member.permissions
    .missing(perms)
    .map(
      str =>
        `\`${str
          .replace(/_/g, " ")
          .replace(/\b(\w)/g, char => char.toUpperCase())}\``
    );

  return missingPerms.length > 1
    ? `${missingPerms.slice(0, -1).join(", ")} et ${missingPerms.slice(-1)[0]}`
    : missingPerms[0];
};
