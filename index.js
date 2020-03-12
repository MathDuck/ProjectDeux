const { Client, Collection } = require("discord.js");
const commandhandler = require("./handlers/commandHandler");
const eventhandler = require("./handlers/EventHandler");
const createDefaultTables = require("./factories/createDefaultTablesFactory");
require("dotenv").config();
const SQLite = require("better-sqlite3");
const db = new SQLite("./data/db.sqlite", { verbose: console.log });

const client = new Client({
  disableEveryone: true,
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
  presence: {
    activity: { name: "botActivityStatus", type: "WATCHING" },
    status: "online"
  }
});

client.commands = new Collection();
client.aliases = new Collection();
client.limits = new Map();

const load = async () => {
  client.db = db;
  console.log(`Chargement des commandes...`);
  await commandhandler.run(client);
  console.log(`Chargement des évents...`);
  await eventhandler.run(client);
  console.log(`Création des tables dans la BDD (si non existantes)...`);
  await createDefaultTables.createDefaultTables(client);
};

load();

client.login(process.env.TOKEN);
