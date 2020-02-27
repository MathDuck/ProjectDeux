const { owners } = require("../config");
const timeFormat = require("../functions/dateFormat");

module.exports = async (client, message) => {
  if (!message.guild || message.author.bot) return;

  const time = timeFormat.getTime(Date.now());
  console.log(
    `Message reçu: "${message.content}" de ${message.author.username} à ${time}`
  );

  if (!client.prefix[message.guild.id]) {
    const data = await client.db
      .prepare(`SELECT * FROM servers WHERE guildid = ? LIMIT 1;`)
      .get(message.guild.id);

    client.prefix[message.guild.id] = data
      ? data.prefix
      : client.prefix["default"];
  }

  const prefixMention = new RegExp(`^<@!?${client.user.id}> `);
  let prefix = message.content.match(prefixMention)
    ? message.content.match(prefixMention)[0]
    : client.prefix[message.guild.id];

  if (!message.content.startsWith(prefix)) return;

  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command.length === 0) return;
  let cmd = client.commands.get(command);
  if (!cmd) cmd = client.commands.get(client.aliases.get(command));
  if (!cmd) return;

  if (cmd.requirements.ownerOnly && !owners.includes(message.author.id)) {
    if (message.deletable) message.delete();
    return message
      .reply("seul un propriétaire du bot peut utiliser cette commande!")
      .then(msg => msg.delete({ timeout: 2000 }));
  }

  if (
    cmd.requirements.userPerms &&
    !message.member.permissions.has(cmd.requirements.userPerms)
  ) {
    if (message.deletable) message.delete();
    return message
      .reply(
        `tu dois avoir les permissions suivantes pour exécuter la commande ${
          cmd.help.name
        }: ${missingPerms(message.member, cmd.requirements.userPerms)}`
      )
      .then(msg => msg.delete({ timeout: 5000 }));
  }

  if (
    cmd.requirements.clientPerms &&
    !message.guild.me.permissions.has(cmd.requirements.clientPerms)
  ) {
    if (message.deletable) message.delete();
    return message
      .reply(
        `je n'ai pas les permissions suivantes pour exécuter la commande ${
          cmd.help.name
        }: ${missingPerms(message.guild.me, cmd.requirements.clientPerms)}`
      )
      .then(msg => msg.delete({ timeout: 5000 }));
  }

  if (cmd.limits && !message.member.permissions.has("ADMINISTRATOR")) {
    const current = client.limits.get(`${command}-${message.author.id}`);
    if (!current) client.limits.set(`${command}-${message.author.id}`, 1);
    else {
      if (current >= cmd.limits.rateLimit) {
        if (message.deletable) message.delete();
        return message
          .reply(
            `évite de spammer ;) (Cooldown: ${cmd.limits.cooldown / 1000}s)`
          )
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
