const { readdirSync } = require("fs");
const { join } = require("path");
const filePath = join(__dirname, "..", "commands");

module.exports.run = client => {
  readdirSync(filePath).forEach(dir => {
    for (const cmd of readdirSync(`${filePath}/${dir}/`).filter(file =>
      file.endsWith(".js")
    )) {
      const prop = require(`${filePath}/${dir}/${cmd}`);
      if (prop.help.name) client.commands.set(prop.help.name, prop);
      else {
        console.log(
          `${cmd} command is missing a help.name or help.name not a string - can't be loaded!`
        );
        continue;
      }
      if (prop.help.aliases && Array.isArray(prop.help.aliases))
        prop.help.aliases.forEach(alias =>
          client.aliases.set(alias, prop.help.name)
        );
    }
  });

  console.log(`${client.commands.size} commandes chargées.`);
};

module.exports.reloadAllCommands = client => {
  readdirSync(filePath).forEach(dir => {
    for (const cmd of readdirSync(`${filePath}/${dir}/`).filter(file =>
      file.endsWith(".js")
    )) {
      const prop = require(`${filePath}/${dir}/${cmd}`);
      const commandName = prop.help.name;
      delete require.cache[require.resolve(`${filePath}/${dir}/${cmd}`)];
      client.commands.delete(commandName);

      if (prop.help.aliases && Array.isArray(prop.help.aliases))
        prop.help.aliases.forEach(alias => client.aliases.delete(alias));
    }
  });
};

module.exports.reloadCommand = (client, commandName) => {
  readdirSync(filePath).forEach(dir => {
    for (const cmd of readdirSync(`${filePath}/${dir}/`).filter(file =>
      file.endsWith(".js")
    )) {
      const prop = require(`${filePath}/${dir}/${cmd}`);
      const command = prop.help.name;
      if (command === commandName) {
        delete require.cache[require.resolve(`${filePath}/${dir}/${cmd}`)];
        client.commands.delete(commandName);

        if (prop.help.aliases && Array.isArray(prop.help.aliases))
          prop.help.aliases.forEach(alias => client.aliases.delete(alias));

        if (prop.help.name) client.commands.set(prop.help.name, prop);

        if (prop.help.aliases && Array.isArray(prop.help.aliases))
          prop.help.aliases.forEach(alias =>
            client.aliases.set(alias, prop.help.name)
          );
      }
    }
  });
};
