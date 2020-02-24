const { Client, Collection } = require("discord.js");
const {
  prefix,
  where,
  botActivityStatus,
  botActivityType,
  botStatus
} = require("./config");
const commandhandler = require("./handlers/commandHandler");
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
client.commands = new Collection();
client.aliases = new Collection();
client.limits = new Map();

//Config
client.prefix = prefix;
client.where = where;

//Commands
commandhandler.run(client);

//Events
eventhandler.run(client);

client.login(process.env.TOKEN);
