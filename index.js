const { Client, Collection } = require("discord.js");
const commandhandler = require("./handlers/commandHandler");
const eventhandler = require("./handlers/EventHandler");
require("dotenv").config();
const SQLite = require("better-sqlite3");
const db = new SQLite("./db.sqlite", { verbose: console.log });

const client = new Client({
  disableEveryone: true,
  presence: {
    activity: { name: "botActivityStatus", type: "WATCHING" },
    status: "online"
  }
});

client.commands = new Collection();
client.aliases = new Collection();
client.limits = new Map();

const load = async () => {
  await commandhandler.run(client);
  await eventhandler.run(client);
  client.db = db;
};

load();

client.login(process.env.TOKEN);
