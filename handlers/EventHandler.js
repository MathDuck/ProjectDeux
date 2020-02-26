const { readdirSync } = require("fs");
const { join } = require("path");
const filePath = join(__dirname, "..", "events");

module.exports.run = client => {
  const eventFiles = readdirSync(filePath);
  for (const eventFile of eventFiles.filter(file => file.endsWith(".js"))) {
    const event = require(`${filePath}/${eventFile}`);
    const eventName = eventFile.split(".").shift();
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`${filePath}/${eventFile}`)];
  }

  console.log(`${eventFiles.length} évents chargé!`);
};
