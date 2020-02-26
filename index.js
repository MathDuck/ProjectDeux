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
const SQLite = require("better-sqlite3");
const db = new SQLite("./db.sqlite");

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
client.prefix = new Object();
client.prefix["default"] = prefix;
client.where = where;

const load = async () => {
  await commandhandler.run(client);
  await eventhandler.run(client);

  db.prepare(
    "CREATE TABLE IF NOT EXISTS servers (guildid TEXT PRIMARY KEY, prefix TEXT, logChannelid TEXT)"
  ).run();

  client.db = db;
};

load();

client.login(process.env.TOKEN);
