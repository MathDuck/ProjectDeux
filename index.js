const { Client, Collection } = require("discord.js");
const {
  prefix,
  where,
  botActivityStatus,
  botActivityType,
  botStatus
} = require("./config");
const commandhandler = require("./handlers/commandHandler");
const Enmap = require("enmap");
const eventhandler = require("./handlers/EventHandler");
require("dotenv").config();

const client = new Client({
  disableEveryone: true,
  presence: {
    activity: { name: botActivityStatus, type: botActivityType },
    status: botStatus
  }
});

//Collections
client.commands = new Enmap();
client.aliases = new Enmap();
client.limits = new Map();

//Config
client.prefix = prefix;
client.where = where;

//Commands
commandhandler.run(client);

//Events
eventhandler.run(client);

client.login(process.env.TOKEN);
