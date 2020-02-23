const { readdirSync } = require("fs");
const { join } = require("path");
const filePath = join(__dirname, "..", "commands");

module.exports.run = client => {
  for (const cmd of readdirSync(filePath).filter(file =>
    file.endsWith(".js")
  )) {
    const prop = require(`${filePath}/${cmd}`);
    if (prop.help.name) client.commands.set(prop.help.name, prop);
    else {
      console.log(
        `${cmd} command is missing a help.name or help.name not a string - can't be loaded!`
      );
      continue;
    }
    if (prop.help.aliases && Array.isArray(prop.help.aliases))
      prop.help.aliases.forEach(alias => {
        client.aliases.set(alias, prop.help.name);
      });
  }

  console.log(`${client.commands.size} commandes chargées.`);
};
