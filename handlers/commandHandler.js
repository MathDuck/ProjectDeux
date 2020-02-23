const { readdirSync } = require("fs");
const { join } = require("path");
const filePath = join(__dirname, "..", "commands");

module.exports.run = client => {
  for (const cmd of readdirSync(filePath).filter(file =>
    file.endsWith(".js")
  )) {
    const prop = require(`${filePath}/${cmd}`);
    if (prop.name) client.commands.set(prop.help.name, prop);
    else {
      console.log(
        `${file} command is missing a help.name or help.name not a string - can't be loaded!`
      );
      continue;
    }

    if (prop.aliases && Array.isArray(prop.aliases))
      prop.aliases.forEach(alias => client.aliases.set(alias, prop.name));
  }

  console.log(`${client.commands.size} commandes chargées.`);
};
