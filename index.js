const { Client, Collection } = require("discord.js");
const { prefix, where } = require("./config");
require("dotenv").config();

const client = new Client({ disableEveryone: true });

//Collections
client.commands = new Collection();
client.aliases = new Collection();

//Config
client.prefix = prefix;
client.where = where;

const commands = require("./handlers/commandHandler");
commands.run(client);
